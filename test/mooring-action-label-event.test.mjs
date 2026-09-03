import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secured-mooring feedback names the keeper-room signaling action", async () => {
  const world = await loadWorld();
  const start = createState(world, 443016);
  const lantern = step(world, start, "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /Signal the secured boat to hold position/i);
});
