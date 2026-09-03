import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, createState, step } from "../src/engine.mjs";

test("mooring feedback explains how to reach the signaling choice", async () => {
  const world = await loadWorld();
  const secured = step(world, step(world, createState(world, 431016), "take_lantern").state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.match(secured.event, /signal the boat from the keeper's room.*enter the keeper's room first/i);
});
