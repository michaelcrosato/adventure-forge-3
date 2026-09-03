import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("early house entry names the later mooring recovery", async () => {
  const world = await loadWorld();
  const lantern = step(world, createState(world, 459016), "take_lantern");
  const entered = step(world, lantern.state, "enter_house");

  assert.equal(entered.ok, true, entered.error);
  assert.match(entered.event, /return to the jetty to secure it before lighting/i);
});
