import test from "node:test";
import assert from "node:assert/strict";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("filled-lantern feedback distinguishes optional tuning from the strongest result", async () => {
  const world = await loadWorld();
  const tower = replayActions(world, 491020, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const filled = step(world, tower, "fill_lantern");

  assert.equal(filled.ok, true, filled.error);
  assert.match(filled.event, /either works/i);
  assert.match(filled.event, /tune both for rescue's strongest result/i);
});
