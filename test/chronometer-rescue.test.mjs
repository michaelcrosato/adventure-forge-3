import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

const markedRoute = [
  "take_lantern",
  "secure_mooring",
  "enter_house",
  "read_log",
  "study_tide_chart",
  "signal_boat",
];

test("the marked, signaled route offers one-time chronometer preparation", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 887, markedRoute).state;

  assert.equal(legalActions(world, keeper).includes("wind_chronometer"), true);
  const wound = step(world, keeper, "wind_chronometer");
  assert.equal(wound.ok, true, wound.error);
  assert.equal(wound.state.flags.includes("chronometer_wound"), true);
  assert.equal(wound.state.score, keeper.score + 1);
  assert.ok(wound.state.journal.includes("Tower chronometer wound for precision."));
  assert.equal(legalActions(world, wound.state).includes("wind_chronometer"), false);
});

test("chronometer preparation offers the precision rescue finish first", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 901, [
    ...markedRoute,
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
  const actions = legalActions(world, prepared);

  assert.equal(actions.includes("light_chronometer_beacon"), false);
  assert.equal(actions.includes("light_rescue_beacon"), false);
  assert.equal(actions.includes("light_all_ready_beacon"), false);
  assert.equal(actions.includes("wait_for_horn"), true);

  const timed = step(world, prepared, "wait_for_horn");
  assert.equal(timed.ok, true, timed.error);
  assert.equal(legalActions(world, timed.state).includes("light_chronometer_beacon"), true);

  const ending = step(world, timed.state, "light_chronometer_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, prepared.score + 11);
});
