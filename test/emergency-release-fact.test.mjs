import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the emergency release records its recovery route", async () => {
  const world = await loadWorld();
  const workshop = replayActions(world, 401, [
    "enter_house",
    "go_workshop",
    "return_keeper_from_workshop",
    "go_workshop",
    "take_fuse",
    "install_fuse",
  ]).state;
  const returned = step(world, workshop, "return_keeper_after_repair");

  assert.equal(returned.ok, true, returned.error);
  assert.ok(
    returned.state.journal.includes(
      "Emergency supply route: recover missing supplies, then use the repaired stair.",
    ),
  );
});
