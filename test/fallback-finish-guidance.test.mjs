import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the untimed tuned finish identifies itself as a fallback", async () => {
  const world = await loadWorld();

  assert.match(world.actions.light_all_ready_beacon.label, /tuned beacon without timing/i);
});
