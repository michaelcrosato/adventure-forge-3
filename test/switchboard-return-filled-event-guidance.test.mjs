import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("switchboard return feedback reflects an already-filled lantern", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 901001, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "climb_tower",
    "fill_lantern",
  ]).state;
  const returned = step(world, filled, "return_keeper_after_fill");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /lantern already filled.*install the fuse.*climb again/i);
  assert.match(returned.event, /closes early chronometer timing/i);
  assert.doesNotMatch(returned.event, /pause the lantern work/i);
});

test("switchboard return feedback preserves prepared chronometer timing after filling", async () => {
  const world = await loadWorld();
  const filled = replayActions(world, 901002, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "wind_chronometer",
    "take_oil",
    "climb_tower",
    "fill_lantern",
  ]).state;
  const returned = step(world, filled, "return_keeper_after_fill");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /lantern already filled.*install the fuse.*climb again/i);
  assert.match(returned.event, /chronometer timing is already prepared/i);
  assert.doesNotMatch(returned.event, /closes early chronometer timing/i);
  assert.doesNotMatch(returned.event, /pause the lantern work/i);
});
