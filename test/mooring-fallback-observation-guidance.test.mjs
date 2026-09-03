import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, observation, replayActions, step } from "../src/engine.mjs";

test("failed mooring recovery removes unavailable signal guidance", async () => {
  const world = await loadWorld();
  const returned = replayActions(world, 7223, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
  ]).state;
  const keeper = step(world, returned, "enter_house").state;
  const text = observation(world, keeper).text;

  assert.equal(keeper.flags.includes("mooring_return_used"), true);
  assert.equal(keeper.flags.includes("mooring_secured"), false);
  assert.equal(legalActions(world, keeper).includes("signal_boat"), false);
  assert.match(text, /mooring is unsecured; use the basic beacon route/i);
  assert.doesNotMatch(text, /signal the boat first|check radio if needed/i);
});
