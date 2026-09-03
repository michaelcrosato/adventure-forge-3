import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a recovered boat gets a distinct tuned fallback finish", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 1169, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
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
  const actions = legalActions(world, tower);

  assert.equal(tower.flags.includes("supply_return_used"), true);
  assert.equal(actions.includes("light_all_ready_beacon"), false);
  assert.equal(actions.includes("light_recovered_tuned_beacon"), true);

  const ending = step(world, tower, "light_recovered_tuned_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
  assert.equal(ending.state.score, tower.score + 8);
});
