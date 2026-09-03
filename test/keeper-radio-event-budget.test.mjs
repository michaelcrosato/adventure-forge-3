import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("keeper-radio feedback stays compact for preparation turns", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.check_storm_radio.text.length < 115);
});
