import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, modelTurnInput, replayActions } from "../src/engine.mjs";

test("model mooring text defines the stronger rescue hierarchy", async () => {
  const world = await loadWorld();
  const replayed = replayActions(world, 379019, ["take_lantern", "secure_mooring"]);
  const input = modelTurnInput(world, replayed.observation);

  assert.match(
    input.text,
    /mooring alone supports a stronger direct rescue; the strongest channel rescue needs the keeper-room signal and radio check/i,
  );
  assert.match(input.text, /signal choice appears after entering the keeper's room/i);
  assert.match(input.last, /basic rescue: skip signaling and light directly/i);
});
