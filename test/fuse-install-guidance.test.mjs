import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("fuse installation points straight to the service ladder", async () => {
  const world = await loadWorld();

  assert.match(world.actions.install_fuse.text, /current reaches the tower/i);
  assert.match(world.actions.install_fuse.text, /climb the service ladder/i);
});
