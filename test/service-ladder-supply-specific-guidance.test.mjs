import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the service ladder names the supplies needed for tower work", async () => {
  const world = await loadWorld();
  const text = world.actions.climb_service_ladder.text;

  assert.match(
    text,
    /return below if supplies are missing: carry the lantern and oil, or fill the lantern first/i,
  );
});
