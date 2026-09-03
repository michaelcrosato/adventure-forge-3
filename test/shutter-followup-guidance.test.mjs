import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("storm shutters point to unfinished beam work before another turn", async () => {
  const world = await loadWorld();

  assert.match(
    world.actions.close_storm_shutters.text,
    /remaining trim or alignment before another turn/i,
  );
});
