import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("lens alignment makes the remaining wick condition explicit", async () => {
  const world = await loadWorld();

  assert.match(
    world.actions.align_lens.text,
    /if it is not already trimmed, trim the wick before lighting the beacon/i,
  );
});
