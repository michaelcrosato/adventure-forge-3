import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secured-mooring feedback separates holding, basic rescue, and channel confirmation", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 548020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.ok(secured.event.length < 438, `mooring feedback is ${secured.event.length} characters`);
  assert.match(secured.event, /boat will hold without signaling/i);
  assert.match(secured.event, /basic rescue: signaling is optional/i);
  assert.match(secured.event, /stronger channel route: later, signal the boat from the keeper's room \(enter the keeper's room first\)/i);
  assert.doesNotMatch(secured.event, /opening a stronger rescue on its own/i);
});
