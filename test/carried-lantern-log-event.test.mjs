import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("the early wall log names parallel precision routes without a late horn surprise", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 526021, ["take_lantern", "enter_house"]).state;
  const logged = step(world, keeper, "read_log");

  assert.equal(logged.ok, true, logged.error);
  assert.equal(
    logged.event,
    "The wall log marks repair and filling as required. Tune both beams for a stronger rescue. Confirmed channel or chronometer timing selects the strongest rescue route; horn timing is required only for the chronometer route.",
  );
  assert.ok(logged.event.length < 240);
});
