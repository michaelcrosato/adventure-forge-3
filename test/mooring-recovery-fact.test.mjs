import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the mooring recovery fact stays compact and stateful", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 739, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
  ]).state;

  assert.ok(state.journal.includes("Mooring recovery used; boat safety restored."));
  assert.ok(state.journal.at(-1).length < 50);
});
