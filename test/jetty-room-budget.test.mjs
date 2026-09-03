import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("jetty room guidance stays compact for start and recovery turns", async () => {
  const world = await loadWorld();

  assert.ok(world.rooms.jetty.text.length < 185);
});
