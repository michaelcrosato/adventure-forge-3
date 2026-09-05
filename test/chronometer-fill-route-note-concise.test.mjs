import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("chronometer fill feedback stays concise after the route is already known", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 268, [
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
  ]).state;
  const filled = step(world, tower, "fill_lantern");
  const input = modelTurnInput(world, observation(world, filled.state, filled.event));

  assert.equal(filled.ok, true, filled.error);
  assert.ok(filled.event.length < 240, filled.event);
  assert.match(filled.event, /chronometer-timed route is the strongest rescue on this timing path/i);
  assert.match(filled.event, /confirmed-channel route is an equally strong alternative after a radio check/i);
  assert.doesNotMatch(filled.event, /flame steady|small flame/i);
  assert.ok(input.last.length < 240, input.last);
  assert.match(input.last, /strongest chronometer-timed rescue after the horn wait/i);
  assert.match(input.last, /without the required horn/i);
  assert.match(input.last, /light directly for the basic finish/i);
});
