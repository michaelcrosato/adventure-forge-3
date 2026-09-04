import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("secure-mooring feedback separates its rescue routes", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 617020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.match(secured.event, /rescue on its own\.\nBasic rescue:/i);
  assert.match(secured.event, /light for the boat directly\.\nStronger channel route:/i);
});
