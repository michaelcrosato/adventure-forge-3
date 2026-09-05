import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions, step } from "../src/engine.mjs";

test("recovered confirmed-channel fill feedback keeps the route undisclosed", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 34000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "study_tide_chart",
    "check_storm_radio",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const filled = step(world, tower, "fill_lantern");
  const input = modelTurnInput(world, observation(world, filled.state, filled.event));

  assert.equal(filled.ok, true, filled.error);
  assert.equal(
    filled.event,
    "Hand lantern filled; small flame holds steady; beacon dark. Beam tuning remains optional before lighting.",
  );
  assert.doesNotMatch(filled.event, /strongest rescue|horn timing/i);
  assert.equal(input.last, "Lantern filled; optional beam tuning remains before lighting.");
});
