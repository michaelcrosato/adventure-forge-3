import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank flag effects", async () => {
  const world = await loadWorld();
  world.actions.read_log.effects = [{ flag: " \n\t" }];

  assert.throws(
    () => validateWorld(world),
    /Action read_log effect flag must not be blank/,
  );
});
