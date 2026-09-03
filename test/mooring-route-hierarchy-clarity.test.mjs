import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secured-mooring feedback labels the basic and stronger routes", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 536020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /Basic rescue:/i);
  assert.match(secured.event, /Stronger channel route:/i);
});
