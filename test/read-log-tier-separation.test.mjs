import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("the wall log separates beam tuning from route selection", async () => {
  const world = await loadWorld();
  const entered = step(world, createState(world, 622020), "enter_house");
  const logged = step(world, entered.state, "read_log");

  assert.equal(logged.ok, true, logged.error);
  assert.match(logged.event, /confirmed channel earns the strongest rescue outcome\. Route choice: tuning affects the beam/i);
  assert.match(logged.event, /channel confirmation or chronometer timing determines the rescue route/i);
});
