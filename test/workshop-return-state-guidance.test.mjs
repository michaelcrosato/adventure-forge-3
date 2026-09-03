import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the installed-fuse backtrack points to the repaired stair", async () => {
  const world = await loadWorld();

  assert.match(
    world.actions.return_keeper_from_workshop.text,
    /service ladder is done.*take oil if needed.*repaired stair/i,
  );
});
