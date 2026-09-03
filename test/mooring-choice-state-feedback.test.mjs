import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("mooring feedback makes the later rescue routes explicit", async () => {
  const world = await loadWorld();
  const jetty = replayActions(world, 3661, ["take_lantern"]).state;
  const secured = step(world, jetty, "secure_mooring");

  assert.equal(secured.ok, true, secured.error);
  assert.equal(secured.state.flags.includes("mooring_secured"), true);
  assert.match(secured.event, /later.*signal the boat from the keeper's room/i);
  assert.match(secured.event, /skip signaling and light for the boat directly/i);
  assert.doesNotMatch(secured.event, /choose:/i);
});
