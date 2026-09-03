import assert from "node:assert/strict";
import test from "node:test";
import {
  createState,
  legalActions,
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  stableStringify,
  step,
} from "../src/engine.mjs";

test("the committed winning plan reaches the beacon deterministically", async () => {
  const world = await loadWorld();
  const first = replayActions(world, 9, world.winningPlan);
  const second = replayActions(world, 9, world.winningPlan);
  assert.equal(first.state.ending, "beacon");
  assert.equal(stableStringify(first.state), stableStringify(second.state));
});

test("an illegal action is rejected without state mutation", async () => {
  const world = await loadWorld();
  const state = createState(world, 1);
  const result = step(world, state, "light_beacon");
  assert.equal(result.ok, false);
  assert.equal(result.state, state);
  assert.equal(state.turn, 0);
});

test("the model sees indexed labels but not stable action IDs or raw flags", async () => {
  const world = await loadWorld();
  const state = createState(world, 1);
  const input = modelTurnInput(world, observation(world, state));
  assert.deepEqual(input.a[0], [0, world.actions[legalActions(world, state)[0]].label]);
  const encoded = JSON.stringify(input);
  assert.doesNotMatch(encoded, /take_lantern/);
  assert.equal("flags" in input, false);
  assert.equal("state" in input, false);
});

test("durable player facts survive stateless model turns", async () => {
  const world = await loadWorld();
  let state = createState(world, 1);
  for (const actionId of ["enter_house", "read_log", "go_workshop"]) {
    const result = step(world, state, actionId);
    assert.equal(result.ok, true, result.error);
    state = result.state;
  }
  const input = modelTurnInput(world, observation(world, state));
  assert.match(input.facts.join(" "), /replace the fuse/i);
});
