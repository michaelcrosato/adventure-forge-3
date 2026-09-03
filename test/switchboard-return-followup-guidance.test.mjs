import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the switchboard return gives the repair route", async () => {
  const world = await loadWorld();
  const text = world.actions.return_keeper_after_fill.text;

  assert.match(text, /pause the lantern work/i);
  assert.match(text, /return to the workshop.*install the fuse.*climb again/i);
});
