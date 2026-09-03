import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank nested flag conditions", async () => {
  const world = await loadWorld();
  world.actions.read_log.when = [{ any: [{ notFlag: " \n\t" }] }];

  assert.throws(
    () => validateWorld(world),
    /Action read_log has an invalid condition/,
  );
});
