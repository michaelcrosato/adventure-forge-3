import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("secured-mooring model copy states one concise rescue hierarchy", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 252, ["take_lantern", "secure_mooring"]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(input.text, /mooring alone supports a stronger direct rescue/i);
  assert.match(input.text, /strongest channel rescue needs the keeper-room signal and radio check/i);
  assert.match(input.text, /signal choice appears after entering the keeper's room/i);
  assert.match(input.text, /label key: direct lighting is the basic rescue; a secured boat is the stronger safety step/i);
  assert.ok(input.text.length < 400, `model copy is ${input.text.length} characters`);
  assert.match(input.last, /basic rescue: skip signaling and light directly/i);
  assert.match(input.last, /stronger channel route: enter the keeper's room.*check the radio/i);
  assert.ok(input.last.length < 240, `model event is ${input.last.length} characters`);
});
