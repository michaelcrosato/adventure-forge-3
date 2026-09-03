# Migration from the two-tool MCP prototype

## Remove

- `.mcp.json`
- `src/mcp-server.mjs`
- `src/mcp-client.mjs`
- MCP protocol tests
- Model-generated outcome and action-trace reports

## Keep

- `game/world.json`
- Pure engine and legal-action generation
- Build hashing
- Content-addressed records
- Deterministic aggregation
- One-task coding loop
- Scripted and exploratory mechanical players

## Change

| MCP prototype | Direct version |
| --- | --- |
| Model calls `game_start` | Supervisor calls `createState` |
| Model calls `game_step` | Model returns an action index |
| Server stores session state | Supervisor holds state locally |
| Model reports action IDs and outcome | Supervisor records both |
| Replay checks a claimed trace | Replay checks the supervisor trace |
| Tool catalog describes two tools | No tool catalog exists |
| `sid` and `rev` cross the model boundary | Neither crosses the model boundary |
| Player command needs an MCP-capable host | Provider module calls the model API directly |

## Result

The new automated lane has fewer trust boundaries and less protocol work. The trade-off is lower interoperability. The direct player adapter must be written once for each provider API that you use.
