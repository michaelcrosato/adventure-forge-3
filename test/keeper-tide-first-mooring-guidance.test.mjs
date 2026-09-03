import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance updates when the tide chart was studied first", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 6501, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
  ]).state;
  const text = observation(world, keeper).text;

  assert.match(text, /tide chart recorded; read the wall log/i);
  assert.match(text, /mooring is unsecured; read the wall log before securing the boat or lighting/i);
  assert.doesNotMatch(text, /before studying tide/i);
});
