import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper guidance stops repeating oil pickup after oil is carried", async () => {
  const world = await loadWorld();
  const earlyKeeper = replayActions(world, 8301, [
    "take_lantern",
    "enter_house",
    "take_oil",
  ]).state;
  const earlyView = observation(world, earlyKeeper);
  const earlyInput = modelTurnInput(world, earlyView);

  assert.match(earlyView.text, /mooring is unsecured; read the wall log before securing the boat or lighting/i);
  assert.doesNotMatch(earlyView.text, /mooring is unsecured; take oil/i);
  assert.doesNotMatch(earlyView.text, /mooring recovery is no longer available/i);
  assert.match(earlyInput.text, /lantern still needs filling/i);
  assert.doesNotMatch(earlyInput.text, /hand lantern will need oil before climbing unless already filled/i);
  assert.match(earlyInput.text, /mooring is unsecured; read the wall log before securing the boat or lighting/i);
  assert.doesNotMatch(earlyInput.text, /mooring is unsecured; take oil/i);

  const keeper = replayActions(world, 8302, [
    "take_lantern",
    "enter_house",
    "read_log",
    "take_oil",
  ]).state;
  const view = observation(world, keeper);
  const input = modelTurnInput(world, view);

  assert.match(view.text, /mooring is unsecured; return to secure it before studying the tide/i);
  assert.doesNotMatch(view.text, /mooring is unsecured; take oil/i);
  assert.match(input.text, /mooring is unsecured; return to secure it before studying the tide/i);
  assert.doesNotMatch(input.text, /mooring is unsecured; take oil/i);
});
