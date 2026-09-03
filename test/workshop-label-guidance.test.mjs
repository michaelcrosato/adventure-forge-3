import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the workshop feedback names its tower-power purpose", async () => {
  const world = await loadWorld();
  const text = world.actions.go_workshop.text;

  assert.match(text, /restore tower power/i);
});
