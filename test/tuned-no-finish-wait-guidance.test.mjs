import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("tuned tower guidance names the horn wait when lighting is not ready", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 98003, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "signal_boat",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "return_keeper_from_tower",
    "take_oil",
    "climb_repaired_stairs",
    "fill_lantern",
    "trim_wick",
    "align_lens",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(legalActions(world, state).filter((id) => id.startsWith("light_")).length, 0);
  assert.deepEqual(legalActions(world, state), ["wait_for_horn"]);
  assert.match(view.text, /beam tuning is complete; wait for the horn before lighting/i);
  assert.match(input.text, /beam tuning is complete; wait for the horn before lighting/i);
  assert.doesNotMatch(input.text, /light now or wait for the horn/i);
});
