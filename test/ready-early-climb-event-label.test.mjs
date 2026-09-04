import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("radio-confirmed oil pickup keeps the early-climb alternative compact", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 285, [
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
  const climb = input.a.find(([, label]) => /unpowered stair/i.test(label));

  assert.ok(climb);
  assert.equal(
    climb[1],
    "Optional early climb: unpowered stair; lantern filling is the exception; costs a return; repair the switchboard afterward",
  );
  assert.ok(climb[1].length < 130);
  assert.ok(input.facts.includes("Radio channel clear."));
});
