import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("secure-mooring feedback does not repeat the action label", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 618020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");
  const input = modelTurnInput(world, observation(world, secured.state, secured.event));

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /^The boat will hold without signaling; stronger rescue on its own\./i);
  assert.doesNotMatch(secured.event, /^Mooring secure:/i);
  assert.match(input.last, /^Mooring secure: the boat will hold without signaling/i);
});
