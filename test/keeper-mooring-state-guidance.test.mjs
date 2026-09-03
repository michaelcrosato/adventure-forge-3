import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance updates the mooring route after clue study", async () => {
  const world = await loadWorld();
  const unsecured = replayActions(world, 6401, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const unsecuredText = observation(world, unsecured).text;

  assert.equal(legalActions(world, unsecured).includes("return_for_mooring"), true);
  assert.match(unsecuredText, /mooring is unsecured; return to secure it before lighting/i);
  assert.doesNotMatch(unsecuredText, /before studying tide/i);
  assert.doesNotMatch(unsecuredText, /if unsecured: read the log/i);

  const secured = replayActions(world, 6402, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "study_tide_chart",
  ]).state;
  const securedText = observation(world, secured).text;

  assert.match(securedText, /mooring is secure; the boat will hold/i);
  assert.doesNotMatch(securedText, /before studying tide/i);
});
