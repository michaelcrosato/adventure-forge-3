import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the pre-oil radio fact stays compact and useful", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 773, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
  ]).state;
  const fact = state.journal.find((entry) => entry === "Radio channel clear.");

  assert.equal(fact, "Radio channel clear.");
  assert.ok(fact.length < 25);
});
