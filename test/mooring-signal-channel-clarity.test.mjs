import test from "node:test";
import assert from "node:assert/strict";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("mooring feedback separates boat holding from radio channel confirmation", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 479020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /signal the boat from the keeper's room.*confirm its hold/i);
  assert.match(secured.event, /radio checks confirm the channel/i);
});
