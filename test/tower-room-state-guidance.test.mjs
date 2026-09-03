import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the tuned tower observation stops asking for finished beam work", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 5101, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]);

  assert.equal(replayed.state.room, "tower");
  assert.equal(legalActions(world, replayed.state).includes("wait_for_horn"), true);
  assert.match(replayed.observation.text, /beam tuning is complete/i);
  assert.match(replayed.observation.text, /light now or wait for the horn/i);
  assert.doesNotMatch(
    replayed.observation.text,
    /finish any trim or alignment before spending a turn to wait/i,
  );
});
