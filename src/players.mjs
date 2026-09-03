import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { PROJECT_ROOT } from "./build-hash.mjs";
import { createSeededRandom } from "./engine.mjs";

function builtInPlayer(policy, world, seed) {
  const random = createSeededRandom(seed);
  const seen = new Set();
  let planIndex = 0;

  return {
    descriptor: {
      kind: "mechanical",
      name: policy,
      model: null,
      isolation: "in_process",
    },

    async choose({ actionIds }) {
      if (actionIds.length === 0) throw new Error("The engine returned no legal action.");
      let index = 0;
      if (policy === "scripted") {
        const planned = world.winningPlan[planIndex];
        const plannedIndex = actionIds.indexOf(planned);
        if (plannedIndex >= 0) {
          planIndex += 1;
          index = plannedIndex;
        }
      } else if (policy === "explorer") {
        const rows = actionIds.map((id, candidate) => ({ id, candidate }));
        const unseen = rows.filter(({ id }) => !seen.has(id) && id !== "leave_island");
        const nonExit = rows.filter(({ id }) => id !== "leave_island");
        const pool = unseen.length ? unseen : nonExit.length ? nonExit : rows;
        index = pool[Math.floor(random() * pool.length)].candidate;
      } else if (policy === "random") {
        index = Math.floor(random() * actionIds.length);
      } else {
        throw new Error(`Unknown built-in player ${policy}.`);
      }
      seen.add(actionIds[index]);
      return { index, usage: null };
    },

    async review() {
      return null;
    },

    async close() {},
  };
}

async function modulePlayer(spec, context) {
  const modulePath = spec.slice("module:".length);
  if (!modulePath) throw new Error("module: player requires a module path.");
  const absolute = resolve(PROJECT_ROOT, modulePath);
  const loaded = await import(`${pathToFileURL(absolute).href}?run=${Date.now()}-${context.seed}`);
  if (typeof loaded.createPlayer !== "function") {
    throw new Error(`${modulePath} must export createPlayer(options).`);
  }
  const player = await loaded.createPlayer({ seed: context.seed, model: context.model });
  if (!player || typeof player.choose !== "function") {
    throw new Error(`${modulePath} createPlayer() must return a choose() function.`);
  }
  return {
    descriptor: {
      kind: "agent",
      name: player.descriptor?.name ?? modulePath,
      model: player.descriptor?.model ?? context.model ?? null,
      isolation: player.descriptor?.isolation ?? "custom_direct_adapter",
    },
    choose: ({ turnInput }) => player.choose({ turnInput }),
    review:
      typeof player.review === "function"
        ? ({ runDigest }) => player.review({ runDigest })
        : async () => null,
    close: typeof player.close === "function" ? player.close.bind(player) : async () => {},
  };
}

export async function createPlayer(spec, context) {
  if (["scripted", "random", "explorer"].includes(spec)) {
    return builtInPlayer(spec, context.world, context.seed);
  }
  if (spec.startsWith("module:")) return modulePlayer(spec, context);
  throw new Error(`Unknown player ${JSON.stringify(spec)}.`);
}
