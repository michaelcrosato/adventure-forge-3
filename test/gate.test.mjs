import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { projectBuildHash, PROJECT_ROOT } from "../src/build-hash.mjs";
import { loadWorld, replayActions } from "../src/engine.mjs";

async function sourceFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = resolve(path, entry.name);
      return entry.isDirectory() ? sourceFiles(target) : [target];
    }),
  );
  return nested.flat();
}

test("the primary repository has no MCP runtime or package dependency", async () => {
  const packageJson = JSON.parse(await readFile(resolve(PROJECT_ROOT, "package.json"), "utf8"));
  assert.deepEqual(packageJson.dependencies ?? {}, {});
  assert.deepEqual(packageJson.devDependencies ?? {}, {});
  const source = (
    await Promise.all(
      (await sourceFiles(resolve(PROJECT_ROOT, "src"))).map((file) => readFile(file, "utf8")),
    )
  ).join("\n");
  assert.doesNotMatch(source, /@modelcontextprotocol|McpServer|mcp-server|\.mcp\.json/i);
});

test("the product build hash and known winning route remain valid", async () => {
  assert.match(await projectBuildHash(), /^[0-9a-f]{64}$/);
  const world = await loadWorld();
  assert.equal(replayActions(world, 1, world.winningPlan).state.ending, "beacon");
});
