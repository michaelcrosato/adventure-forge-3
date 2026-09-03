import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secure-mooring feedback explains the signal's payoff without menu meta", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 469017), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /use .*Signal the secured boat to hold position.*to confirm/i);
  assert.doesNotMatch(secured.event, /choose the keeper-room action/i);
});
