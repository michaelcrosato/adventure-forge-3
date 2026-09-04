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

test("reachable tower observations stay within the player text budget", async () => {
  const world = await loadWorld();
  const queue = [createState(world, 1)];
  const seen = new Set();
  let checked = 0;

  while (queue.length) {
    const state = queue.pop();
    const key = stableStringify(state);
    if (seen.has(key)) continue;
    seen.add(key);

    if (!state.ended && state.room === "tower") {
      const text = observation(world, state).text;
      checked += 1;
      assert.ok(
        text.length <= 560,
        `tower observation is ${text.length} characters at turn ${state.turn}`,
      );
    }

    for (const actionId of legalActions(world, state)) {
      const result = step(world, state, actionId);
      if (result.ok && !result.state.ended) queue.push(result.state);
    }
  }

  assert.ok(checked > 0);
});
