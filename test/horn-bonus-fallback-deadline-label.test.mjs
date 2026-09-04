import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the last-turn fallback label keeps a stored horn bonus", async () => {
  const world = await loadWorld();
  const late = replayActions(world, 902002, [
    "enter_house",
    "read_log",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "climb_tower",
    "return_keeper_after_fill",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "climb_repaired_stairs",
    "trim_wick",
    "align_lens",
    "wait_for_horn",
  ]).state;
  const view = observation(world, late);
  const input = modelTurnInput(world, view);

  assert.equal(late.turn, world.maxTurns - 1);
  assert.match(view.actions[0][1], /without timing bonus.*wait for horn bonus/i);
  assert.match(input.a[0][1], /horn bonus/i);
  assert.doesNotMatch(input.a[0][1], /without timing bonus|wait for horn bonus/i);
});
