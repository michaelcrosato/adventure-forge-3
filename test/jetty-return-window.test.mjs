import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions } from "../src/engine.mjs";

test("the lantern fetch route requires taking the lantern before re-entering", async () => {
  const world = await loadWorld();
  const jetty = replayActions(world, 331, [
    "enter_house",
    "go_jetty",
  ]).state;

  assert.equal(jetty.flags.includes("jetty_return_used"), true);
  assert.equal(legalActions(world, jetty).includes("enter_house"), false);
  assert.equal(legalActions(world, jetty).includes("take_lantern"), true);

  const keeper = replayActions(world, 331, [
    "enter_house",
    "go_jetty",
    "take_lantern",
    "enter_house",
  ]).state;
  assert.equal(keeper.inventory.includes("lantern"), true);
});
