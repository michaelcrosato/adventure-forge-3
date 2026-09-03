import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("missing-lantern recovery feedback stays compact", async () => {
  const world = await loadWorld();

  assert.ok(world.actions.return_keeper_for_lantern.text.length < 145);
});
