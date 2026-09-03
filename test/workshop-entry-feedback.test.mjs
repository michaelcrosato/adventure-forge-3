import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("entering the workshop names the repair objective", async () => {
  const world = await loadWorld();

  assert.match(world.actions.go_workshop.text, /switchboard/i);
  assert.match(world.actions.go_workshop.text, /fuse/i);
});
