import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions } from "../src/engine.mjs";

test("the log fact keeps its repair sequence compact", async () => {
  const world = await loadWorld();
  const state = replayActions(world, 751, ["enter_house", "read_log"]).state;
  const fact = state.journal.at(-1);

  assert.match(fact, /replace the fuse/i);
  assert.match(fact, /fill the lantern/i);
  assert.match(fact, /light the beacon/i);
  assert.ok(fact.length < 60);
});
