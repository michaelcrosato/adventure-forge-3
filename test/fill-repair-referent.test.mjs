import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("filling the lantern names the repair that still sends the player below", async () => {
  const world = await loadWorld();
  const text = world.actions.fill_lantern.text;

  assert.match(text, /if repair remains.*switchboard fuse.*return below/i);
});
