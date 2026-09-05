import assert from "node:assert/strict";
import test from "node:test";
import {
  createState,
  loadWorld,
  modelTurnInput,
  observation,
  replayActions,
  step,
} from "../src/engine.mjs";

test("opening mooring guidance keeps the stronger route optional", async () => {
  const world = await loadWorld();
  const opening = modelTurnInput(world, observation(world, createState(world, 977003)));

  assert.match(opening.text, /stronger boat route.*enter the house to investigate first if you prefer/i);

  const entered = step(
    world,
    step(world, createState(world, 977004), "take_lantern").state,
    "enter_house",
  );
  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /if you want the stronger boat route; the basic rescue remains available/i);

  const keeper = replayActions(world, 977005, [
    "take_lantern",
    "enter_house",
    "study_tide_chart",
    "read_log",
    "take_oil",
  ]).state;
  const later = modelTurnInput(world, observation(world, keeper));

  assert.match(later.text, /return only if you want the stronger boat route/i);
  assert.match(later.a[0][1], /optional stronger route/i);
  assert.match(later.a[0][1], /secure the mooring before lighting/i);
});
