import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the untimed tuned-beacon label identifies a valid fallback rescue", async () => {
  const world = await loadWorld();
  const label = world.actions.light_all_ready_beacon.label;

  assert.match(label, /without timing bonus/i);
  assert.match(label, /valid fallback rescue/i);
});
