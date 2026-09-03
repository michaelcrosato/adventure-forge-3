import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filling the lantern omits the repair warning after the fuse is installed", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 3411, [
    "take_lantern",
    "enter_house",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const filled = step(world, tower, "fill_lantern");

  assert.equal(filled.ok, true, filled.error);
  assert.match(filled.event, /small flame holds steady.*trim the wick or align the beacon lens/i);
  assert.doesNotMatch(filled.event, /repair remains.*return below/i);
});
