import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("eventful house entry keeps early investigation open", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 8001), "take_lantern");
  const entered = step(world, lantern.state, "enter_house");
  const input = modelTurnInput(world, observation(world, entered.state, entered.event));

  assert.equal(entered.ok, true, entered.error);
  assert.equal(
    input.text,
    "The wall log and tide chart are here; oil and the workshop await. When ready, fill the lantern in the tower.",
  );
  assert.doesNotMatch(input.text, /study the tide chart first|return to the jetty|stronger boat route|basic rescue/i);
  assert.match(input.text, /wall log and tide chart/i);
  assert.match(input.text, /fill the lantern in the tower/i);
});
