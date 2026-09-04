import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper model input does not repeat a recorded tide-first log cue", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16007, [
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const logMentions = input.text.match(/read the wall log/gi) ?? [];

  assert.equal(legalActions(world, state).includes("read_log"), true);
  assert.equal(logMentions.length, 1);
  assert.match(input.text, /mooring is unsecured; recover the lantern, then secure the boat before lighting/i);
  assert.doesNotMatch(input.text, /recover the lantern and read the wall log/i);
});

test("keeper model input does not repeat the log in the carried-supply route", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16008, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "return_keeper_from_tower",
    "take_oil",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const logMentions = input.text.match(/read the wall log/gi) ?? [];

  assert.equal(legalActions(world, state).includes("read_log"), true);
  assert.equal(logMentions.length, 1);
  assert.match(input.text, /mooring is unsecured; secure the boat before lighting/i);
  assert.doesNotMatch(input.text, /read the wall log before securing the boat/i);
});
