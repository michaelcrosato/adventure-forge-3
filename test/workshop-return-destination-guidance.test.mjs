import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the installed-workshop event names its supply-return destination", async () => {
  const world = await loadWorld();
  const text = world.actions.go_workshop.text;

  assert.match(text, /otherwise return to the keeper's room for missing supplies/i);
});
