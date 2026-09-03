import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld } from "../src/engine.mjs";

test("mooring feedback frames the rescue routes as a choice", async () => {
  const world = await loadWorld();
  const text = world.actions.secure_mooring.text;

  assert.match(
    text,
    /choose: signal it from the keeper's room for a confirmed channel, or keep the mooring secured and light for the boat directly/i,
  );
});
