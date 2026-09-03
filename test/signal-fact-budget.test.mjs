import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the boat signal fact stays compact and actionable", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 761, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
  ]).state;
  const fact = state.journal.find((entry) => entry === "Boat signaled to hold.");

  assert.equal(fact, "Boat signaled to hold.");
  assert.ok(fact.length < 30);
});
