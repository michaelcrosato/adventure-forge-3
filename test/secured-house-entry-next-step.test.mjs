import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("secured house entry separates current status from the optional signal", async () => {
  const world = await loadWorld();
  const secured = replayActions(world, 492020, ["take_lantern", "secure_mooring"]).state;
  const entered = step(world, secured, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /boat will hold.*no return is needed/i);
  assert.match(
    entered.event,
    /next step \(optional\): signal the boat from the keeper's room for a confirmed channel/i,
  );
  assert.match(entered.event, /status rule.*if mooring unsecured.*once secure, boat holds/i);
});
