import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the oil pickup points to filling the lantern before climbing", async () => {
  const world = await loadWorld();
  const text = world.actions.take_oil.text;

  assert.match(text, /sealed oil flask/i);
  assert.match(text, /hand lantern before climbing/i);
});
