import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("filling the lantern points below when fuse repair remains", async () => {
  const world = await loadWorld();

  assert.match(
    world.actions.fill_lantern.text,
    /if repair remains.*return below.*else trim the wick or align the beacon lens/i,
  );
});
