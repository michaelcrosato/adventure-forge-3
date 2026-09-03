import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("fuse-install feedback keeps its tightened routing budget", async () => {
  const world = await loadWorld();
  const text = world.actions.install_fuse.text;

  assert.ok(text.length < 90);
  assert.match(text, /current reaches the tower.*climb the service ladder/i);
});
