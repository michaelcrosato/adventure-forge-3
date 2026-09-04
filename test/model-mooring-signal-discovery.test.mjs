import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("model mooring input locates the later signal choice", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 379019, ["take_lantern", "secure_mooring"]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(input.text, /signal choice appears after entering the keeper's room/i);
  assert.match(input.last, /stronger channel route.*enter the keeper's room.*check the radio/i);
  assert.deepEqual(input.a.map(([, label]) => label), [
    "Enter the keeper's house",
    "Abandon the station",
  ]);
});
