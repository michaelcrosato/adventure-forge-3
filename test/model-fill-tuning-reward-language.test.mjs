import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("the model fill event distinguishes one tuning upgrade from both", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 615020, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const filled = step(world, tower, "fill_lantern");
  const input = modelTurnInput(world, observation(world, filled.state, filled.event));

  assert.match(input.last, /tuning is optional: trim the wick or align the lens for a stronger rescue/i);
  assert.match(input.last, /do both for the strongest/i);
  assert.doesNotMatch(input.last, /either tuning choice|both together/i);
});
