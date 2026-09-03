import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, step, createState } from "../src/engine.mjs";

test("the jetty offers a one-time mooring safety bonus after taking the lantern", async () => {
  const world = await loadWorld();
  let state = step(world, createState(world, 167), "take_lantern").state;

  assert.equal(legalActions(world, state).includes("secure_mooring"), true);
  const secured = step(world, state, "secure_mooring");
  assert.equal(secured.ok, true, secured.error);
  state = secured.state;
  assert.equal(state.flags.includes("mooring_secured"), true);
  assert.equal(state.score, 2);
  assert.equal(legalActions(world, state).includes("secure_mooring"), false);
});
