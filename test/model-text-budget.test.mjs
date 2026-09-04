import assert from "node:assert/strict";
import test from "node:test";
import {
  createState,
  legalActions,
  loadWorld,
  modelTurnInput,
  observation,
  stableStringify,
  step,
} from "../src/engine.mjs";

test("every reachable model turn stays within the bounded text budget", async () => {
  const world = await loadWorld();
  const queue = [createState(world, 1)];
  const seen = new Set();
  let checked = 0;

  while (queue.length) {
    const state = queue.pop();
    const key = stableStringify(state);
    if (seen.has(key)) continue;
    seen.add(key);

    if (!state.ended) {
      const input = modelTurnInput(world, observation(world, state));
      checked += 1;
      assert.ok(
        input.text.length <= 560,
        `model text is ${input.text.length} characters at ${state.room}, turn ${state.turn}`,
      );
    }

    for (const actionId of legalActions(world, state)) {
      const result = step(world, state, actionId);
      if (result.ok && !result.state.ended) queue.push(result.state);
    }
  }

  assert.ok(checked > 0);
});
