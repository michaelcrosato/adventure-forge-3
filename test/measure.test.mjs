import assert from "node:assert/strict";
import test from "node:test";
import { measureWinningRoute } from "../src/measure.mjs";

test("the direct route has no server, protocol tool, or tool catalog", async () => {
  const result = await measureWinningRoute();
  assert.equal(result.serverProcesses, 0);
  assert.equal(result.protocolTools, 0);
  assert.equal(result.toolCatalogBytes, 0);
  assert.equal(result.actionOutputShape, '{"a":N}');
  assert.equal(result.outcome, "beacon");
});
