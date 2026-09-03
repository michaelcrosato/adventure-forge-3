#!/usr/bin/env node
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createState, loadWorld, modelTurnInput, observation, step } from "./engine.mjs";

function bytes(value) {
  return Buffer.byteLength(JSON.stringify(value));
}

export async function measureWinningRoute() {
  const world = await loadWorld();
  let state = createState(world, 1);
  let event = null;
  const turnInputBytes = [];
  const actionOutputBytes = [];
  const frames = [[0, world.start, world.rooms[state.room].title, "START", world.rooms[state.room].text]];

  for (const actionId of world.winningPlan) {
    const view = observation(world, state, event);
    const input = modelTurnInput(world, view);
    const index = view.actions.findIndex(([id]) => id === actionId);
    if (index < 0) throw new Error(`Winning action ${actionId} is not legal.`);
    turnInputBytes.push(bytes(input));
    actionOutputBytes.push(bytes({ a: index }));
    const result = step(world, state, actionId);
    if (!result.ok) throw new Error(result.error);
    state = result.state;
    event = result.event;
    frames.push([
      state.turn,
      state.room,
      world.rooms[state.room].title,
      world.actions[actionId].label,
      event,
    ]);
  }

  const finalView = observation(world, state, event);
  const reviewDigest = {
    goal: world.objective,
    outcome: finalView.end
      ? { id: finalView.end[0], title: finalView.end[1], text: finalView.end[2] }
      : null,
    turns: state.turn,
    score: state.score,
    facts: state.journal,
    route: frames,
  };

  const totalTurnInput = turnInputBytes.reduce((sum, value) => sum + value, 0);
  const totalActionOutput = actionOutputBytes.reduce((sum, value) => sum + value, 0);
  return {
    architecture: "in-process structured-output supervisor",
    serverProcesses: 0,
    protocolTools: 0,
    toolCatalogBytes: 0,
    engineSteps: world.winningPlan.length,
    actionModelCalls: world.winningPlan.length,
    reviewModelCalls: 1,
    actionOutputShape: '{"a":N}',
    turnInputBytes: {
      total: totalTurnInput,
      mean: totalTurnInput / turnInputBytes.length,
      max: Math.max(...turnInputBytes),
    },
    actionOutputBytes: {
      total: totalActionOutput,
      mean: totalActionOutput / actionOutputBytes.length,
    },
    reviewInputBytes: bytes(reviewDigest),
    outcome: state.ending,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  measureWinningRoute()
    .then((result) => process.stdout.write(`${JSON.stringify(result, null, 2)}\n`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
