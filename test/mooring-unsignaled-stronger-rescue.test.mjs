import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secured-mooring feedback says the stronger rescue does not require signaling", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 493020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /stronger rescue on its own/i);
  assert.match(secured.event, /signaling is optional/i);
  assert.match(secured.event, /stronger channel route/i);
});
