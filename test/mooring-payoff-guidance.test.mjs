import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("the mooring step explains its stronger-rescue payoff", async () => {
  const world = await loadWorld();

  assert.match(world.actions.secure_mooring.text, /opening the way to a stronger rescue/i);
});
