import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secured-mooring feedback states that signaling is not needed to hold the boat", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 502020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /boat will hold without signaling/i);
});
