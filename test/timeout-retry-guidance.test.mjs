import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the timeout ending gives a concrete retry hint", async () => {
  const world = await loadWorld();

  assert.match(world.endings.timeout.text, /leave one turn for the final light/i);
});
