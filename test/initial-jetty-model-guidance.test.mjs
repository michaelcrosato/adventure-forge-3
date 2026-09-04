import assert from "node:assert/strict";
import test from "node:test";
import { createState, loadWorld, modelTurnInput, observation } from "../src/engine.mjs";

test("initial jetty model guidance names the lantern prerequisite for mooring", async () => {
  const world = await loadWorld();
  const input = modelTurnInput(world, observation(world, createState(world, 240)));

  assert.match(input.text, /take the lantern first; securing the line becomes available next/i);
  assert.doesNotMatch(input.text, /take the lantern if it remains; secure the line before entering/i);
  assert.deepEqual(
    input.a.map(([, label]) => label),
    ["Take the brass lantern", "Enter the keeper's house", "Abandon the station"],
  );
});
