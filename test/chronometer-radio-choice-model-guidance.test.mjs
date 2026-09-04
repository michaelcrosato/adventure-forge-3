import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("chronometer prep tells the model that radio checking switches routes", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 245, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
  ]);
  const input = modelTurnInput(world, replayed.observation);
  const radio = input.a.find(([index]) => replayed.observation.actions[index][0] === "check_storm_radio");

  assert.match(input.text, /chronometer timing is prepared; take the oil to keep that timed route/i);
  assert.match(input.text, /check the radio instead to switch to the confirmed-channel route/i);
  assert.ok(radio);
  assert.match(radio[1], /optional alternative.*switch from chronometer timing to the confirmed-channel route/i);
});
