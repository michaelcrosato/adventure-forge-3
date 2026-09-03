import test from "node:test";
import assert from "node:assert/strict";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("secured house entry does not send the player back to the jetty", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 480020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /mooring is secure.*boat will hold/i);
  assert.doesNotMatch(entered.event, /return to the jetty to secure it/i);
});
