import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("workshop entry identifies its relation to the keeper's room", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 451016, ["enter_house"]).state;
  const entered = step(world, keeper, "go_workshop");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /workshop beside the keeper's room/i);
});
