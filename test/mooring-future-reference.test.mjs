import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secure-mooring feedback frames the menu quote as future reference", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 624020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(
    secured.event,
    /For later reference, keeper-room menu offers the choice: use "Signal the secured boat to hold position" to confirm its hold/i,
  );
});
