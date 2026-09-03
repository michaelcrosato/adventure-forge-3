import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("jetty guidance stays compact while preserving setup cues", async () => {
  const world = await loadWorld();
  const text = world.rooms.jetty.text;

  assert.ok(text.length < 170);
  assert.match(text, /take the lantern if it remains.*secure the line before entering.*boat to hold/i);
});
