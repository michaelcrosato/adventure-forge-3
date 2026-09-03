import test from "node:test";
import assert from "node:assert/strict";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("mooring feedback marks signaling as optional", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 482020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /keeper-room menu offers the choice/i);
  assert.match(secured.event, /signaling is optional/i);
});
