import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the service-ladder event names its destination naturally", async () => {
  const world = await loadWorld();
  const text = world.actions.climb_service_ladder.text;

  assert.match(text, /climb the service ladder to the tower/i);
  assert.match(text, /return below if supplies are missing/i);
});
