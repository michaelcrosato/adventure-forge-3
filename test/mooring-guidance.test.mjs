import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the jetty warns that mooring must happen before entering", async () => {
  const world = await loadWorld();

  assert.match(world.rooms.jetty.text, /secure the line before entering/i);
});
