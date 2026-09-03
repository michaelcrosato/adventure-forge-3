import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("lens-alignment feedback distinguishes beam tuning from channel confirmation", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 558020, [
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
  assert.match(aligned.event, /strongest rescue beam/i);
  assert.match(aligned.event, /confirmed channel earns the strongest rescue outcome/i);
});
