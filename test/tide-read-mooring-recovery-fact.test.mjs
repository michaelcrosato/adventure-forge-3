import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("post-tide mooring recovery records that the line still needs securing", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 86001, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "return_for_mooring",
  ]).state;

  const recoveryFact = "Mooring recovery used; mooring remains unsecured.";
  assert.ok(state.journal.includes(recoveryFact));
  assert.ok(!state.journal.includes("Mooring recovery used; boat safety restored."));
  assert.ok(recoveryFact.length < 50);
});

test("securing the recovered mooring retires its pending fact", async () => {
  const world = await loadWorld();
  const returned = replayActions(world, 86002, [
    "take_lantern",
    "enter_house",
    "read_log",
    "study_tide_chart",
    "return_for_mooring",
  ]);
  const secured = step(world, returned.state, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.ok(!secured.state.journal.includes("Mooring recovery used; mooring remains unsecured."));
  assert.ok(secured.state.journal.includes("Mooring recovery used; mooring is now secure."));
  assert.ok(secured.state.journal.includes("The supply boat's mooring is secure."));
});
