import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("wall-log feedback separates beam tuning from route selection compactly", async () => {
  const world = await loadWorld();
  const entered = step(world, createState(world, 544020), "enter_house");
  const logged = step(world, entered.state, "read_log");

  assert.equal(logged.ok, true, logged.error);
  assert.ok(logged.event.length < 380, `wall-log feedback is ${logged.event.length} characters`);
  assert.match(logged.event, /tune both for the strongest rescue beam/i);
  assert.match(logged.event, /confirmed channel earns the strongest rescue outcome/i);
  assert.match(
    logged.event,
    /tuning affects the beam; channel confirmation or chronometer timing determines the rescue route/i,
  );
});
