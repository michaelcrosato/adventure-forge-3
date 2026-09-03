import assert from "node:assert/strict";
import test from "node:test";
import {
  createState,
  legalActions,
  loadWorld,
  observation,
  stableStringify,
  step,
} from "../src/engine.mjs";

test("every reachable live final turn exposes a rescue or the exit", async () => {
  const world = await loadWorld();
  const queue = [createState(world, 1)];
  const seen = new Set();
  let finalStates = 0;

  while (queue.length) {
    const state = queue.pop();
    const key = stableStringify(state);
    if (seen.has(key)) continue;
    seen.add(key);

    const legal = legalActions(world, state);
    if (state.turn === world.maxTurns - 1) {
      finalStates += 1;
      const finishers = legal.filter((id) =>
        world.actions[id].effects.some((effect) => effect.end === "beacon"),
      );
      assert.ok(finishers.length > 0 || legal.includes("leave_island"));

      const expected = finishers.length > 0 ? finishers : ["leave_island"];
      assert.deepEqual(
        observation(world, state).actions,
        expected.map((id) => [id, world.actions[id].label]),
      );
    }

    for (const actionId of legal) {
      const result = step(world, state, actionId);
      if (result.ok && !result.state.ended) queue.push(result.state);
    }
  }

  assert.ok(finalStates > 0);
});
