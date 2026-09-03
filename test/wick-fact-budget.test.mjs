import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the wick-trim fact stays compact and descriptive", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 787, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
  ]).state;
  const fact = state.journal.find((entry) => entry === "Wick trimmed for a clean beam.");

  assert.equal(fact, "Wick trimmed for a clean beam.");
  assert.ok(fact.length < 35);
});
