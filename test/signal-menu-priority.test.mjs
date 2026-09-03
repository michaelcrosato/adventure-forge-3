import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the keeper-room menu places the stated signal priority first", async () => {
  const world = await loadWorld();
  const actions = world.rooms.keeper_room.actions;

  assert.ok(actions.indexOf("signal_boat") < actions.indexOf("study_tide_chart"));
});
