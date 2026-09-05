import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, modelTurnInput, observation, step } from "../src/engine.mjs";

test("the eventful lantern pickup leaves the opening choice open", async () => {
  const world = await loadWorld();
  const picked = step(world, createState(world, 100033), "take_lantern");
  const view = observation(world, picked.state, picked.event);
  const input = modelTurnInput(world, view);

  assert.equal(
    input.text,
    "The keeper's house waits in the rain. Enter to investigate; the mooring can be secured later if needed.",
  );
  assert.equal(input.goal, "Investigate the keeper's house first; the mooring is optional.");
  assert.equal(input.last, "Lantern carried; the house and optional mooring are ahead.");
  assert.deepEqual(input.a.map(([, label]) => label), [
    "Secure the supply boat's mooring (optional)",
    "Enter the keeper's house",
    "Abandon the station",
  ]);
});
