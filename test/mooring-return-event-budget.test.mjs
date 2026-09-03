import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("mooring recovery feedback stays compact and ordered", async () => {
  const world = await loadWorld();
  const text = world.actions.return_for_mooring.text;

  assert.ok(text.length < 120);
  assert.match(text, /after reading the log.*secure the supply boat's mooring.*then re-enter/i);
});
