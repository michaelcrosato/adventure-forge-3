import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("mooring recovery remains available after an early workshop detour", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 743, [
    "take_lantern",
    "enter_house",
    "go_workshop",
    "return_keeper_from_workshop",
    "read_log",
    "take_oil",
  ]).state;

  assert.equal(keeper.flags.includes("workshop_return_used"), true);
  assert.equal(legalActions(world, keeper).includes("return_for_mooring"), true);

  const jetty = step(world, keeper, "return_for_mooring");
  assert.equal(jetty.ok, true, jetty.error);
  assert.equal(jetty.state.room, "jetty");

  const secured = step(world, jetty.state, "secure_mooring");
  assert.equal(secured.ok, true, secured.error);
  assert.equal(secured.state.flags.includes("mooring_secured"), true);
});
