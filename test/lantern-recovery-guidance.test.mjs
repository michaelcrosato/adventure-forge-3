import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern return points to the recovery rescue", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_for_lantern.text;

  assert.match(text, /collect the missing lantern/i);
  assert.match(text, /moored boat can still be rescued/i);
});
