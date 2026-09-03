import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation rejects blank model-visible room and item identifiers", async () => {
  const world = await loadWorld();
  world.rooms["  "] = { title: "Spare room", text: "A spare room.", actions: [] };

  assert.throws(() => validateWorld(world), /Room identifier must not be blank/);

  delete world.rooms["  "];
  world.items[" \t"] = "spare item";

  assert.throws(() => validateWorld(world), /Item identifier must not be blank/);
});
