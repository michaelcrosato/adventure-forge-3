import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("opening events confirm state without replaying the mooring route", async () => {
  const world = await loadWorld();
  const picked = step(world, createState(world, 87001), "take_lantern");
  const entered = step(world, picked.state, "enter_house");

  assert.equal(picked.ok, true, picked.error);
  assert.equal(picked.event, "You take the lantern from a hook; the keeper's house is ready.");
  assert.doesNotMatch(picked.event, /secure the mooring|signal the boat/i);
  assert.equal(entered.ok, true, entered.error);
  assert.equal(
    entered.event,
    "Mooring unsecured; boat may not hold. Once secured, boat holds. Read the wall log and take the oil; return to the jetty to secure it before lighting if you want the stronger boat route; the basic rescue remains available.",
  );
  assert.ok(entered.event.length < 240);
});
