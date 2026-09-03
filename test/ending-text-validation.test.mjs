import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank ending text", async () => {
  const world = await loadWorld();
  world.endings.timeout.text = "";

  assert.throws(() => validateWorld(world), /Ending timeout requires title and text/);
});
