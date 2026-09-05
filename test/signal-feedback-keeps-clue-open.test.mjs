import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("post-signal feedback keeps an unread tide clue open when oil is ready", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 764021, [
    "take_lantern",
    "secure_mooring",
    "enter_house",
    "read_log",
    "take_oil",
  ]).state;
  const signaled = step(world, keeper, "signal_boat");

  assert.equal(signaled.ok, true, signaled.error);
  assert.equal(
    signaled.event,
    "Ring the bell; supply boat holds position. The tide chart is still unread.",
  );
  assert.doesNotMatch(signaled.event, /before climbing/i);
});
