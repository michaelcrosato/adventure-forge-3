import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("the bounded final-turn event does not suggest hidden tuning", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 107, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "wind_chronometer",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "check_storm_radio",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "trim_wick",
  ]);
  const input = modelTurnInput(world, replayed.observation);

  assert.equal(replayed.state.turn, world.maxTurns - 1);
  assert.deepEqual(replayed.observation.actions, [["light_trimmed_beacon", world.actions.light_trimmed_beacon.label]]);
  assert.match(replayed.observation.event, /align the beacon lens before lighting/i);
  assert.match(input.last, /beacon finish remains; light now; remaining preparation is too late/i);
  assert.doesNotMatch(input.last, /align the beacon lens|finish beam tuning|light next turn/i);
});
