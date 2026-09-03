import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the mooring recovery label presents a plain sequence", async () => {
  const world = await loadWorld();
  const label = world.actions.return_for_mooring.label;

  assert.doesNotMatch(label, /\(/);
  assert.match(label, /return[—-]secure the mooring before tide study/i);
  assert.match(label, /recovery remains open afterward/i);
});
