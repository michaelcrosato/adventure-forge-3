import assert from "node:assert/strict";
import test from "node:test";
import { legalActions, loadWorld, replayActions, step } from "../src/engine.mjs";

test("a signaled boat gets a dedicated unmodified-beam finish", async () => {
  const world = await loadWorld();
  const prepared = replayActions(world, 223, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "signal_boat",
    "take_oil",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
    "fill_lantern",
  ]).state;

  assert.equal(legalActions(world, prepared).includes("light_beacon"), false);
  assert.equal(legalActions(world, prepared).includes("light_signaled_beacon"), true);
  const ending = step(world, prepared, "light_signaled_beacon");
  assert.equal(ending.ok, true, ending.error);
  assert.equal(ending.state.ending, "beacon");
});
