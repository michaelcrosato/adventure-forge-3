import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("lens alignment names the remaining wick choice and direct finish", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 464016, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "take_oil",
    "signal_boat",
    "study_tide_chart",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const aligned = step(world, tower, "align_lens");

  assert.equal(aligned.ok, true, aligned.error);
  assert.match(aligned.event, /trim the wick now for the strongest rescue/i);
  assert.match(aligned.event, /otherwise light the aligned beacon/i);
});
