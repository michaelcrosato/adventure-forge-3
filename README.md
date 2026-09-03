# Direct Game Loop

A small reference implementation of this path:

**AI-coded game → direct structured-output playtests → verified reports → one ranked task → AI coding agent**

There is no MCP server, HTTP game service, tool catalog, JSON-RPC transport, or model-visible session handle. The playtest supervisor imports the deterministic engine and owns game state in-process.

## Why this version does not use MCP

The automated lane is closed:

- One supervisor launches every playtest.
- The same supervisor owns the engine and state.
- A player can only select from the current legal-action menu.
- No unrelated client must discover the game.
- No remote service boundary is required.

Under these conditions, MCP adds capabilities that the loop does not use. Direct structured output is smaller and easier to verify.

Do not use this design as a universal replacement for MCP. Add an adapter later when ChatGPT, Claude Code, IDEs, or third-party clients must connect independently.

## Core contract

Each player turn receives compact JSON such as:

```json
{
  "goal": "Relight the storm beacon before the supply boat leaves.",
  "t": [3, 16],
  "at": ["keeper_room", "Keeper's Room"],
  "text": "A cold stove, a wall log, and a sealed oil flask remain.",
  "inv": ["lantern", "oil"],
  "facts": ["Replace the fuse, fill the hand lantern, then use its flame on the beacon."],
  "last": "You take the sealed oil flask.",
  "a": [[0, "Return to the jetty"], [1, "Enter the workshop"], [2, "Climb to the lantern room"]]
}
```

The player returns only:

```json
{"a":1}
```

The supervisor maps index `1` to the stable action ID, validates it, calls the engine directly, and records the result. The model never supplies an outcome, action trace, session ID, or revision.

After the game ends, one structured review call returns ratings and short findings. The supervisor then replays the action IDs before it stores the report.

## Run it

Node.js 22 or later is required. There are no runtime package dependencies.

```bash
npm test
npm run measure
npm run playtest -- --player mix --runs 6 --concurrency 3
npm run loop -- --player mix --cycles 1 --runs 6
```

The default `mix` wave uses deterministic scripted, explorer, and random players. It tests the engine and direct supervisor without model cost.

## Measured local path

The included winning route produces these JSON byte measurements:

| Measure | Result |
| --- | ---: |
| Server processes | 0 |
| Protocol tools | 0 |
| Tool-catalog bytes | 0 |
| Engine actions | 9 |
| Action-choice calls | 9 |
| Review calls | 1 |
| Mean compact turn input | 785 bytes |
| Mean action output | 7 bytes |
| Review input | 2,096 bytes |

These values measure JSON bytes, not tokenizer-specific tokens. Deterministic playtests do not require credentials or network access.

## Add another model provider

Create a local module that exports `createPlayer(options)`:

```js
export function createPlayer({ seed, model }) {
  return {
    descriptor: {
      name: "my-provider",
      model,
      isolation: "direct-api"
    },

    async choose({ turnInput }) {
      // Call the provider with turnInput only.
      // Return the zero-based menu index, not an action ID.
      return { index: 0, usage: null };
    },

    async review({ runDigest }) {
      return {
        ratings: { fun: 4, clarity: 4 },
        replayIntent: "maybe",
        summary: "Short player summary.",
        findings: []
      };
    },

    async close() {}
  };
}
```

Run it with:

```bash
npm run playtest -- \
  --player module:./path/to/player.mjs \
  --model provider-model-id \
  --runs 4
```

The provider module receives only the compact player view. The supervisor validates the returned index and maps it to the stable engine action ID.

## Run the coding loop

Set `AI_CODER_CMD` to a non-interactive coding command. The command must read its task from standard input, edit the current project, run checks, and exit nonzero on failure.

```bash
export AI_CODER_CMD='your-coding-agent-command'

npm run loop -- \
  --player mix \
  --cycles 3 \
  --runs 6 \
  --concurrency 3
```

One cycle does this:

1. Run `npm test`.
2. Run a direct playtest wave against the current build hash.
3. Replay every stored action trace.
4. Aggregate only records for that exact build.
5. Write one `NEXT_TASK.md` item.
6. Give that item to the coding agent.
7. Reject edits to the control plane or any existing test.
8. Reject a successful agent exit when the game build hash did not change.
9. Run `npm test` again.
10. Complete the known winning route directly through the engine.

The loop does not commit, reset, push, merge, or delete Git state.

## Validation

The included repository was checked with:

- 15 Node tests: all pass.
- One deterministic scripted winning route: `beacon`.
- One six-run mechanical wave through the direct supervisor.
- One disposable full cycle: two corroborating fixture reports → one task → coding-agent fixture → changed product hash → tests → verified winning route.
- One hostile fixture check: a coding agent that edited `src/playtest.mjs` was rejected by the protected-tree gate.

## Repository map

```text
game/world.json          Story data and declarative rules
src/engine.mjs           Pure reducer, legal actions, compact views, replay
src/players.mjs          Built-in players and custom-provider loader
src/playtest.mjs         In-process sessions, waves, reports, concurrency
src/aggregate.mjs        Build-bound clustering and one-task selection
src/build-hash.mjs       Product build identity
src/loop.mjs             One-task coding cycle
src/measure.mjs          Direct-path byte measurements
fixtures/                Test provider modules
artifacts/runs/           Content-addressed playtest records
test/                    Node test suite
docs/ARCHITECTURE.md     Decision rules and Mermaid maps
```

## Design limits

- The engine is the only authority for legality, state, outcomes, and replay.
- The model emits one action index per turn.
- Action calls are stateless. Durable facts come from engine state.
- One review call runs after the ending.
- Reports are bound to a build hash.
- The coding prompt contains one promoted issue and at most three evidence lines.
- Provider or API failures are recorded as run failures. They do not become game tasks.
- No server boundary exists until a real external-client requirement appears.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the complete design.
