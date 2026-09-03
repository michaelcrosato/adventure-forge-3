import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("a fully tuned tower relay label does not ask for spent tuning actions", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 913001, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const input = modelTurnInput(world, observation(world, tower));
  const relay = input.a.find(([, label]) => /tower relay/i.test(label));

  assert.equal(legalActions(world, tower).includes("check_tower_radio"), true);
  assert.ok(relay);
  assert.match(relay[1], /beam tuning is complete/i);
  assert.match(relay[1], /costs one turn/i);
  assert.doesNotMatch(relay[1], /tune first/i);
});
