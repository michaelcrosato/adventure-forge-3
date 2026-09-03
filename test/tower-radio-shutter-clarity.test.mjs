import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("tower radio feedback explains that barring shutters means closing them", async () => {
  const world = await loadWorld();
  const text = world.actions.check_tower_radio.text;

  assert.match(text, /bar storm shutters before this check if needed: close for a sheltered finish/i);
});
