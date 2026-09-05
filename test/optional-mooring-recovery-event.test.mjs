import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("mooring recovery events leave the stronger route as a choice", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 111002, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "take_oil",
  ]).state;
  const returned = step(world, keeper, "return_for_mooring");

  assert.equal(returned.ok, true, returned.error);
  assert.match(
    returned.event,
    /if you want the stronger boat route, secure the supply boat's mooring next/i,
  );
});
