import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, step } from "../src/engine.mjs";

test("wall-log feedback distinguishes beam tuning from the strongest outcome", async () => {
  const world = await loadWorld();
  const logged = step(world, createState(world, 561020), "enter_house");
  const result = step(world, logged.state, "read_log");

  assert.equal(result.ok, true, result.error);
  assert.match(result.event, /tune both for the strongest rescue beam/i);
  assert.match(result.event, /confirmed channel earns the strongest rescue outcome/i);
});
