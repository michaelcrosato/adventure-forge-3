import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("the model separates secure-mooring rescue routes for scanning", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 610020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");
  const input = modelTurnInput(world, observation(world, secured.state, secured.event));

  assert.deepEqual(input.last.split("\n"), [
    "Mooring secure: the boat will hold without signaling; this is already a stronger rescue.",
    "Basic rescue: skip signaling and light directly.",
    "Stronger channel route: enter the keeper's room, signal the secured boat, then check the radio.",
  ]);
});
