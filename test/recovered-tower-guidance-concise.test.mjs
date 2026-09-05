import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("recovered filled tower guidance keeps the unfinished choices concise", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 29000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_after_repair",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
  ]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.equal(
    input.text,
    "Lantern filled. Tune the beam, check the tower relay, or wait for the horn before lighting.",
  );
  assert.ok(input.text.length < 140);
  assert.doesNotMatch(input.text, /strongest rescue|sheltered|marked-tide|finish categories|before the final turn/i);
});
