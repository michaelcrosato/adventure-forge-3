import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("confirmed-channel tuning labels avoid premature deadline language", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 26003, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const view = observation(world, tower);
  const trim = view.actions.find(([id]) => id === "trim_wick");
  const align = view.actions.find(([id]) => id === "align_lens");

  assert.equal(tower.turn, 13);
  assert.equal(trim?.[1], "Trim the wick for a cleaner beam");
  assert.equal(align?.[1], "Align the lens for a truer beam");
  assert.doesNotMatch(`${trim?.[1]} ${align?.[1]}`, /last turn/i);

  const trimmed = step(world, tower, "trim_wick");
  const later = observation(world, trimmed.state);
  const laterAlign = later.actions.find(([id]) => id === "align_lens");
  assert.equal(laterAlign?.[1], "Align the lens for a truer beam");
});
