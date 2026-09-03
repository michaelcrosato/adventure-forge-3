import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the untimed tuned-beacon label explains how the timing bonus is earned", async () => {
  const world = await loadWorld();
  const label = world.actions.light_all_ready_beacon.label;

  assert.ok(label.length <= 160);
  assert.match(label, /wait for horn bonus when available/i);
});
