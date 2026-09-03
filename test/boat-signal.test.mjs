import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("the secured boat can be signaled to hold position", async () => {
  const world = await loadWorld();
  let state = createState(world, 211);
  state = step(world, state, "take_lantern").state;
  state = step(world, state, "secure_mooring").state;
  state = step(world, state, "enter_house").state;

  assert.equal(legalActions(world, state).includes("signal_boat"), true);
  const signaled = step(world, state, "signal_boat");
  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(signaled.state.flags.includes("boat_signaled"), true);
  assert.equal(signaled.state.score, 3);
  assert.equal(legalActions(world, signaled.state).includes("signal_boat"), false);
});
