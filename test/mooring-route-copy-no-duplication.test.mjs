import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("mooring feedback states each signaling route once", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 519020), "take_lantern");
  const secured = step(world, lantern.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.equal((secured.event.match(/signal the boat from the keeper's room/gi) ?? []).length, 1);
  assert.match(secured.event, /skip signaling and light for the boat directly/i);
  assert.match(secured.event, /stronger channel route/i);
});
