import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower relay points to tuning before the radio rescue finish", async () => {
  const world = await loadWorld();
  const text = world.actions.check_tower_radio.text;

  assert.match(text, /channel is clear/i);
  assert.match(text, /finish beam tuning.*confirmed-channel rescue beacon/i);
});
