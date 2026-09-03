import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower relay label exposes its deadline cost to the model", async () => {
  const world = await loadWorld();
  const label = world.actions.check_tower_radio.label;

  assert.match(label, /costs one turn/i);
  assert.match(label, /before last turn/i);
});
