# Agent rules

Make one small product change per cycle.

- Product files are `game/world.json` and `src/engine.mjs`.
- You may add a new focused test under `test/`.
- Do not edit existing tests, package scripts, model adapters, playtest code, feedback code, or the cycle gate.
- Keep the engine deterministic. A game step must not use file I/O, network access, wall time, or ambient randomness.
- Keep automated playtests in process. Do not add MCP, an HTTP game server, or a general tool protocol.
- Player action output must remain one structured action index: `{"a": N}`.
- The player model must receive only the bounded turn input. Do not give it source files, raw state, or tools.
- Do not edit generated files under `artifacts/` or `NEXT_TASK.md`.
- Run `npm test` before completion.
