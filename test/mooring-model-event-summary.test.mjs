import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("the model receives a compact hierarchy summary after securing the mooring", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 574020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");
  const input = modelTurnInput(world, observation(world, secured.state, secured.event));

  assert.match(input.last, /boat will hold without signaling.*already a stronger rescue/i);
  assert.match(input.last, /basic rescue: skip signaling and light directly/i);
  assert.match(input.last, /stronger channel route.*enter the keeper's room.*check the radio/i);
  assert.ok(input.last.length < 240);
  assert.doesNotMatch(input.last, /keeper-room menu offers the choice|Signal the secured boat to hold position/i);
});
