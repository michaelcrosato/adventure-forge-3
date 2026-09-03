import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the mooring recovery label names its tide-study ordering", async () => {
  const world = await loadWorld();

  assert.match(world.actions.return_for_mooring.label, /before tide study/i);
  assert.match(world.actions.return_for_mooring.label, /secure the mooring/i);
});
