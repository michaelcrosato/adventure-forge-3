import assert from "node:assert/strict";
import test from "node:test";
import { measureWinningRoute } from "../src/measure.mjs";

test("the winning route keeps each model turn under one kilobyte", async () => {
  const result = await measureWinningRoute();

  assert.ok(result.turnInputBytes.max < 1000);
});
