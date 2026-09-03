import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("house entry stops promising mooring recovery after its window is gone", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 130001, [
    "enter_house",
    "read_log",
    "study_tide_chart",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "go_workshop",
    "return_keeper_after_repair",
    "go_jetty",
    "take_lantern",
  ]).state;

  assert.equal(keeper.room, "jetty");
  assert.equal(keeper.flags.includes("mooring_secured"), false);
  assert.equal(legalActions(world, keeper).includes("enter_house"), true);

  const entered = step(world, keeper, "enter_house");
  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /recovery return is no longer available/i);
  assert.match(entered.event, /continue with the basic beacon route/i);
  assert.doesNotMatch(entered.event, /return to the jetty/i);
});
