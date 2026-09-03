import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("oil pickup leaves filling open before or after the climb", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 431016, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
  ]).state;

  const oil = step(world, keeper, "take_oil");
  assert.equal(oil.ok, true, oil.error);
  assert.match(oil.event, /fill the hand lantern before lighting/i);
  assert.match(oil.event, /whether you climb now or later/i);
});
