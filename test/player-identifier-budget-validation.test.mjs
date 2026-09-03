import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, validateWorld } from "../src/engine.mjs";

test("world validation bounds model-visible room and item identifiers", async () => {
  const world = await loadWorld();
  const longRoomId = "r".repeat(161);
  world.rooms[longRoomId] = { title: "Spare room", text: "A spare room.", actions: [] };

  assert.throws(
    () => validateWorld(world),
    /Room .* identifier must be at most 160 characters/,
  );

  delete world.rooms[longRoomId];
  const longItemId = "i".repeat(161);
  world.items[longItemId] = "spare item";

  assert.throws(
    () => validateWorld(world),
    /Item .* identifier must be at most 160 characters/,
  );
});
