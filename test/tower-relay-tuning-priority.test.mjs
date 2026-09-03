import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower relay label puts beam tuning first", async () => {
  const world = await loadWorld();

  assert.match(world.actions.check_tower_radio.label, /tune first/i);
});
