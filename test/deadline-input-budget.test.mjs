import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput } from "../src/engine.mjs";

test("the final-turn deadline cue stays compact", async () => {
  const world = await loadWorld();
  const input = modelTurnInput(world, {
    turn: [world.maxTurns - 1, world.maxTurns],
    at: ["tower", "Lantern Room"],
    text: "Light now.",
    actions: [],
  });

  assert.ok(input.deadline.length < 60);
});
