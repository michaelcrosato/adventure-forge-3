import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("late chronometer trimming does not imply beacon ignition", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 587, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "wind_chronometer",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;
  const trimmed = step(world, tower, "trim_wick");
  const input = modelTurnInput(world, observation(world, trimmed.state, trimmed.event));

  assert.equal(tower.turn, world.maxTurns - 9);
  assert.equal(trimmed.ok, true, trimmed.error);
  assert.equal(
    trimmed.event,
    "Wick trimmed; beacon remains dark; lens remains unaligned. The remaining beam adjustment is optional before lighting.",
  );
  assert.match(input.text, /wick trimmed; beacon remains dark/i);
  assert.match(input.last, /beacon remains dark/i);
  assert.doesNotMatch(`${trimmed.event} ${input.text} ${input.last}`, /clean, steady flame/i);
});
