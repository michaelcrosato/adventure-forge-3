import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("oil pickup gives the bounded workshop choice a compact repair label", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 279, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
  ]);
  const input = modelTurnInput(world, replayed.observation);
  const workshop = input.a.find(([index]) => replayed.observation.actions[index][0] === "go_workshop");

  assert.ok(workshop);
  assert.equal(workshop[1], "Enter the workshop; install the fuse before climbing");
  assert.ok(workshop[1].length < 70);
});
