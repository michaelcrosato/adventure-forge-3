import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the untimed tuned-beacon label explains its stronger prepared-channel outcome", async () => {
  const world = await loadWorld();
  const label = world.actions.light_all_ready_beacon.label;

  assert.match(label, /tuned prepared channel still earns a stronger rescue/i);
});
