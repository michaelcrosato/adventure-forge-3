import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("an early house entry can recover the optional mooring step", async () => {
  const world = await loadWorld();
  let state = step(world, createState(world, 733), "take_lantern").state;
  state = step(world, state, "enter_house").state;
  state = step(world, state, "read_log").state;

  assert.equal(legalActions(world, state).includes("return_for_mooring"), true);
  const returned = step(world, state, "return_for_mooring");
  assert.equal(returned.ok, true, returned.error);
  assert.equal(returned.state.room, "jetty");
  assert.equal(legalActions(world, returned.state).includes("secure_mooring"), true);
});
