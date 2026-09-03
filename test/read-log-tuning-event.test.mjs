import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("reading the wall log names optional beam tuning", async () => {
  const world = await loadWorld();
  const entered = step(world, createState(world, 544020), "enter_house");
  const logged = step(world, entered.state, "read_log");

  assert.equal(logged.ok, true, logged.error);
  assert.match(logged.event, /required sequence.*replace the fuse.*fill the hand lantern.*light the beacon/i);
  assert.match(logged.event, /optional tuning: trim the wick or align the lens before lighting/i);
  assert.match(logged.event, /tune both for the strongest rescue/i);
});
