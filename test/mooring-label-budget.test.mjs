import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("mooring recovery label stays compact for bounded menus", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.return_for_mooring.label.length < 85);
});
