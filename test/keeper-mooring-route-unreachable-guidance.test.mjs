import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("keeper copy drops mooring recovery after its route is unreachable", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "keeper_room");
  assert.equal(state.turn, 8);
  assert.equal(legalActions(world, state).includes("return_for_mooring"), false);
  assert.match(view.text, /secured-boat and radio routes are unavailable/i);
  assert.match(view.text, /mooring recovery is no longer available; continue with the basic beacon route/i);
  assert.doesNotMatch(view.text, /signal the boat first|return to secure the mooring/i);
  assert.doesNotMatch(input.text, /signal the boat first|secure the mooring before signaling|return to secure the mooring/i);
});

test("keeper copy drops dynamic mooring guidance after the workshop return is spent", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 1, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "take_oil",
    "go_workshop",
    "return_keeper_from_workshop",
  ]).state;
  const view = observation(world, state);
  const input = modelTurnInput(world, view);

  assert.equal(state.room, "keeper_room");
  assert.equal(state.turn, 6);
  assert.equal(legalActions(world, state).includes("return_for_mooring"), false);
  assert.match(view.text, /secured-boat and radio routes are unavailable/i);
  assert.match(view.text, /mooring recovery is no longer available; continue with the basic beacon route/i);
  assert.doesNotMatch(view.text, /signal the boat first|secure the mooring before signaling|return to secure the mooring/i);
  assert.doesNotMatch(input.text, /signal the boat first|secure the mooring before signaling|return to secure the mooring/i);
});
