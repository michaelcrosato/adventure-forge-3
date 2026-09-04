import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("missing-lantern model input keeps recovery guidance singular", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16010, ["enter_house", "take_oil"]).state;
  const input = modelTurnInput(world, observation(world, state));
  const recoveryMentions = input.text.match(/recover (?:it|the lantern)/gi) ?? [];

  assert.equal(legalActions(world, state).includes("go_jetty"), true);
  assert.equal(recoveryMentions.length, 2);
  assert.match(input.text, /lantern is still missing; recover it before filling/i);
  assert.match(input.text, /mooring is unsecured; recover the lantern and read the wall log/i);
  assert.doesNotMatch(input.text, /oil is ready; recover the lantern before filling/i);
});

test("missing-lantern model input keeps carried-supply recovery singular", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 16011, [
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "return_keeper_for_lantern",
  ]).state;
  const input = modelTurnInput(world, observation(world, state));
  const recoveryMentions = input.text.match(/recover (?:it|the lantern)/gi) ?? [];

  assert.equal(legalActions(world, state).includes("go_jetty"), true);
  assert.equal(recoveryMentions.length, 2);
  assert.match(input.text, /mooring is unsecured; recover the lantern and read the wall log, then secure the boat before lighting/i);
  assert.doesNotMatch(input.text, /oil is ready; recover the lantern before filling/i);
});
