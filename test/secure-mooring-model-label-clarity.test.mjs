import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("secure-mooring model copy defines the rescue label hierarchy", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 7411, ["take_lantern", "secure_mooring"]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(
    input.text,
    /label key: direct lighting is the basic rescue; a secured boat is the stronger safety step; signaling and radio make the strongest channel route/i,
  );
});
