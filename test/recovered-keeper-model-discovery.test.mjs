import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("recovered keeper re-entry keeps the remaining investigation choices open", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 26000, [
    "take_lantern",
    "enter_house",
    "read_log",
    "return_for_mooring",
    "secure_mooring",
    "enter_house",
  ]);
  const input = modelTurnInput(world, keeper.observation);

  assert.equal(
    input.text,
    "The recovered boat holds. The tide chart, signal, oil, and workshop remain; choose what to investigate next.",
  );
  assert.doesNotMatch(input.text, /check radio|before climbing|strongest rescue|chronometer|horn timing/i);
  assert.match(input.last, /signal the boat for a confirmed channel/i);
});
