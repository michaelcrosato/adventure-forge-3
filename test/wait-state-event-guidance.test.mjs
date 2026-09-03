import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("an untuned horn wait defines the no-tide logged fallback and next step", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 455016, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "take_oil",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  const waited = step(world, tower, "wait_for_horn");

  assert.equal(waited.ok, true, waited.error);
  assert.match(waited.event, /with the wall log and no tide mark.*tuned-beacon finish after tuning/i);
  assert.match(waited.event, /light next turn.*never wait on the last turn/i);
});
