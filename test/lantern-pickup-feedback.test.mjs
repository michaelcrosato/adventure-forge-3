import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the lantern pickup points to securing the mooring", async () => {
  const world = await loadWorld();
  const text = world.actions.take_lantern.text;

  assert.match(text, /lantern from a hook/i);
  assert.match(text, /secure the mooring line before entering/i);
});
