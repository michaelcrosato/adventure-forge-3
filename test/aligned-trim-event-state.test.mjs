import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("trimming after lens alignment says the beacon is still dark", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 75005, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
    "align_lens",
  ]).state;
  const trimmed = step(world, tower, "trim_wick");

  assert.equal(trimmed.ok, true, trimmed.error);
  assert.equal(trimmed.event, "Clean, steady flame; beacon remains dark.");
});
