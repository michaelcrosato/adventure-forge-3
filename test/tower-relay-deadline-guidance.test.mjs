import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the tower relay warns that checking costs the last turn", async () => {
  const world = await loadWorld();

  assert.match(world.actions.check_tower_radio.text, /before the last turn.*costs a turn/i);
});
