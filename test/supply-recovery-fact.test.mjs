import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

const RECOVERY_FACT = "Emergency supply route: recover missing supplies, then use the repaired stair.";

test("tower supply returns preserve the recovery clue", async () => {
  const world = await loadWorld();

  const oilTower = replayActions(world, 1151, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "climb_service_ladder",
  ]).state;
  const oilKeeper = step(world, oilTower, "return_keeper_from_tower");
  assert.equal(oilKeeper.ok, true, oilKeeper.error);
  assert.ok(oilKeeper.state.journal.includes(RECOVERY_FACT));

  const lanternTower = replayActions(world, 1153, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
    "take_oil",
    "go_workshop",
    "climb_service_ladder",
  ]).state;
  const lanternKeeper = step(world, lanternTower, "return_keeper_for_lantern");
  assert.equal(lanternKeeper.ok, true, lanternKeeper.error);
  assert.ok(lanternKeeper.state.journal.includes(RECOVERY_FACT));
});
