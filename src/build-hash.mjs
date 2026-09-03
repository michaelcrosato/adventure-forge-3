import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sha256 } from "./engine.mjs";

export const PROJECT_ROOT = fileURLToPath(new URL("..", import.meta.url));
export const PRODUCT_FILES = Object.freeze(["game/world.json", "src/engine.mjs"]);

function productPath(root, relative, worldPath) {
  if (relative !== "game/world.json" || worldPath === undefined) return resolve(root, relative);
  return worldPath instanceof URL ? fileURLToPath(worldPath) : resolve(root, worldPath);
}

export async function projectBuildHash(root = PROJECT_ROOT, worldPath) {
  const chunks = [];
  for (const relative of PRODUCT_FILES) {
    chunks.push(relative, "\0", await readFile(productPath(root, relative, worldPath), "utf8"), "\0");
  }
  return sha256(chunks.join(""));
}
