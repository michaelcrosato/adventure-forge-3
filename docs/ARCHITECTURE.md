# Direct Game Loop architecture

## Decision

Use the direct supervisor only when all of these statements are true:

1. The automated runner owns the engine process.
2. The player only needs a closed set of game actions.
3. The runner owns state, outcomes, and trace recording.
4. No third-party client needs runtime discovery.
5. No remote game-service boundary is required.
6. Audited proof of an external client's complete tool surface is not a requirement.

These conditions hold for the autonomous playtest lane. They do not necessarily hold for manual play, public integrations, or remote products.

```mermaid
flowchart TD
    START["Need an AI playtest interface"] --> OWN{"Does one supervisor own\nthe engine and model calls?"}
    OWN -->|"No"| MCP["Use MCP or an HTTP API"]
    OWN -->|"Yes"| CLOSED{"Can every turn be one choice\nfrom a legal-action menu?"}
    CLOSED -->|"No"| TOOLS["Use local function tools or a richer API"]
    CLOSED -->|"Yes"| CLIENTS{"Must unrelated external clients\ndiscover and call the game?"}
    CLIENTS -->|"Yes"| MCP
    CLIENTS -->|"No"| DIRECT["Use direct structured output"]
```

## Runtime architecture

```mermaid
flowchart LR
    WORLD["world.json"] --> ENGINE["Pure deterministic engine"]
    ENGINE --> SUPERVISOR["In-process playtest supervisor"]

    subgraph PLAYERS["Player adapters"]
        BUILTIN["Scripted / random / explorer"]
        CUSTOM["Custom provider module"]
    end

    SUPERVISOR --> BUILTIN
    SUPERVISOR --> CUSTOM
    BUILTIN -->|"action index"| SUPERVISOR
    CUSTOM -->|"action index"| SUPERVISOR

    SUPERVISOR --> TRACE["Stable action IDs"]
    TRACE --> REPLAY["Deterministic replay"]
    REPLAY --> RECORDS[("Build-bound records")]
    RECORDS --> AGG["Cluster and rank"]
    AGG --> TASK["NEXT_TASK.md\none issue"]
    TASK --> CODER["Coding agent command"]
    CODER --> WORLD
    CODER --> ENGINE
    ENGINE --> TESTS["Tests + scripted winning run"]
```

## Player-turn sequence

```mermaid
sequenceDiagram
    participant S as Supervisor
    participant E as Engine library
    participant P as Player adapter

    S->>E: createState(seed)
    E-->>S: state
    S->>E: observation(state)
    E-->>S: compact view + legal action IDs
    S->>S: Replace IDs with indexed labels

    loop Until ending
        S->>P: Compact view and indexed menu
        P-->>S: {"a": index}
        S->>S: Map index to stable action ID
        S->>E: step(state, action ID)
        E-->>S: next state + event
    end

    S->>P: Compact completed-run digest
    P-->>S: ratings + findings
    S->>E: replayActions(seed, recorded IDs)
    E-->>S: verified final state
    S->>S: Store authoritative record
```

The player never controls the state machine. It does not report the action trace or outcome. This is stronger and smaller than asking an MCP client to play and then trusting its final report.

## Coding cycle

```mermaid
stateDiagram-v2
    [*] --> BaselineTests
    BaselineTests --> Failed: red
    BaselineTests --> PlaytestWave: green
    PlaytestWave --> Replay
    Replay --> Aggregate: verified
    Replay --> Failed: mismatch
    Aggregate --> NoChange: no promoted finding
    Aggregate --> TaskReady: one promoted finding
    TaskReady --> NoChange: no coding command
    TaskReady --> Code: coding command configured
    Code --> Integrity
    Integrity --> Failed: control plane or existing test changed
    Integrity --> BuildCheck: protected files unchanged
    BuildCheck --> Failed: product hash unchanged
    BuildCheck --> PostTests: product hash changed
    PostTests --> Failed: red or build drift
    PostTests --> WinningRun: green and protected
    WinningRun --> Failed: known route fails
    WinningRun --> Complete: beacon ending
    NoChange --> [*]
    Complete --> [*]
    Failed --> [*]
```

## Token controls

```mermaid
flowchart LR
    STATIC["Static instruction"] --> ACTION["One action request"]
    STATE["Current compact state"] --> ACTION
    MENU["Indexed labels"] --> ACTION
    ACTION --> OUT["{a:N}"]
    OUT --> LOCAL["Local engine step"]

    LOCAL --> NEXT["Next compact state"]
    NEXT --> ACTION

    LOCAL --> END{"Ended?"}
    END -->|"Yes"| REVIEW["One compact review request"]
    REVIEW --> FINDINGS["Ratings + short findings"]
```

Controls:

- No tool definitions.
- No tool-selection tokens.
- No JSON-RPC envelope.
- No model-visible session ID or revision.
- No raw state.
- No full transcript on each turn.
- One-field action output.
- Stateless action calls with durable facts supplied by the engine.
- One review call after the ending.
- Optional provider usage is stored when a custom module reports it.

## Data ownership

| Data | Authority |
| --- | --- |
| Legal actions | Engine |
| Current state | Supervisor and engine |
| Action trace | Supervisor |
| Outcome | Engine |
| Trace validity | Deterministic replay |
| Ratings and experience findings | Player model |
| Promotion and ranking | Deterministic aggregator |
| Code change | Coding agent |
| Acceptance | Tests, build hash, winning run |

## Repository structure

```mermaid
flowchart TB
    ROOT["direct-game-loop/"]
    ROOT --> GAME["game/\nworld.json"]
    ROOT --> SRC["src/"]
    ROOT --> TEST["test/"]
    ROOT --> DOCS["docs/"]
    ROOT --> RUNS["artifacts/runs/"]

    SRC --> ENGINE["engine.mjs"]
    SRC --> PLAYERS["players.mjs"]
    SRC --> PLAYTEST["playtest.mjs"]
    SRC --> AGG["aggregate.mjs"]
    SRC --> HASH["build-hash.mjs"]
    SRC --> LOOP["loop.mjs"]
    SRC --> MEASURE["measure.mjs"]
```

## Build order

1. Build a pure deterministic reducer.
2. Put content and rules in data.
3. Make legal actions an engine output.
4. Build one in-process session runner.
5. Define the player adapter interface.
6. Add deterministic CI players.
7. Add an optional provider module only when an external model is required.
8. Record the supervisor-owned action trace.
9. Replay before accepting a report.
10. Bind reports to the product build hash.
11. Aggregate into one task.
12. Add the coding-agent command and mechanical post-change gates.
13. Measure actual requests, tokens, and prompt bytes.
14. Add an external protocol only after an external-client requirement exists.

## When to add a protocol

Add MCP when an existing MCP host must play the game without importing this repo.

Add HTTP when playtest workers must run on other machines or in a hosted fleet.

Add a small child-process JSON protocol when the engine must be isolated from crashes or written in another language.

Do not add any of these only to make an in-process call look more architectural. The boundary must solve an actual ownership, deployment, or interoperability requirement.

## Scaling path

The direct interface stays stable as the system grows:

```text
player.choose(compact turn) -> action index
engine.step(state, action ID) -> next state
player.review(compact run) -> findings
```

A later distributed runner can move the supervisor behind HTTP without changing the engine. A later MCP adapter can translate `game_start` and `game_step` into the same engine calls. Neither protocol should become the engine's source of truth.
