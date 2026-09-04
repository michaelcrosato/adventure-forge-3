import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, observation, replayActions } from "../src/engine.mjs";

test("secured-mooring model copy explicitly ranks the direct rescue tier", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 252, ["take_lantern", "secure_mooring"]);
  const input = modelTurnInput(world, observation(world, replayed.state, replayed.observation.event));

  assert.match(input.text, /direct lighting is the basic rescue/i);
  assert.match(input.text, /secured direct lighting is the stronger direct route/i);
  assert.ok(input.text.length < 400, `model copy is ${input.text.length} characters`);
});
