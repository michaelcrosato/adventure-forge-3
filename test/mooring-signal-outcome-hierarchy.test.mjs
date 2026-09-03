import test from "node:test";
import assert from "node:assert/strict";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("mooring feedback distinguishes basic rescue from the stronger signal route", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 489020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /optional for a basic rescue/i);
  assert.match(secured.event, /stronger channel route/i);
});
