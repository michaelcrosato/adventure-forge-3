import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the wall log explains its stronger-rescue payoff", async () => {
  const world = await loadWorld();

  assert.match(world.actions.read_log.text, /keeper's sequence can strengthen the rescue/i);
});
