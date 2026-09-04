import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("the model wait label names the final-turn restriction plainly", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 613020, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const wait = input.a.find(([, label]) => /wait for the horn/i.test(label));

  assert.ok(wait, "expected the wait action in the model menu");
  assert.match(wait[1], /do not wait on the final turn/i);
  assert.doesNotMatch(wait[1], /never on last turn/i);
});
