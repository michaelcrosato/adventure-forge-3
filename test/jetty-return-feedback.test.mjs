import assert from "node:assert/strict";
import test from "node:test";
import { createState, legalActions, loadWorld, step } from "../src/engine.mjs";

test("the lantern recovery return points to the needed pickup", async () => {
  const world = await loadWorld();
  const keeper = step(world, createState(world, 607), "enter_house").state;
  const returned = step(world, keeper, "go_jetty");

  assert.equal(returned.ok, true, returned.error);
  assert.match(returned.event, /fetch the missing lantern/i);
  assert.equal(legalActions(world, returned.state).includes("take_lantern"), true);
});
