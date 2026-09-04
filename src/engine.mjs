import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_WORLD_URL = new URL("../game/world.json", import.meta.url);
const PLAYER_FACT_LIMIT = 14;
const PLAYER_FACT_LENGTH = 280;
const PLAYER_LABEL_LENGTH = 160;
const PLAYER_TEXT_LENGTH = 560;
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const isRecord = (value) => value && typeof value === "object" && !Array.isArray(value);

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function worldHash(world) {
  return sha256(stableStringify(world));
}

export async function loadWorld(pathOrUrl = process.env.DIRECT_WORLD ?? DEFAULT_WORLD_URL) {
  const path = pathOrUrl instanceof URL ? fileURLToPath(pathOrUrl) : resolve(pathOrUrl);
  return validateWorld(JSON.parse(await readFile(path, "utf8")));
}

export function validateWorld(world) {
  if (!world || typeof world !== "object" || Array.isArray(world)) {
    throw new Error("World must be an object.");
  }
  for (const key of ["id", "title", "objective", "start"]) {
    if (typeof world[key] !== "string" || world[key].trim().length === 0) {
      throw new Error(`World requires a non-empty string ${key}.`);
    }
  }
  if (world.objective.length > PLAYER_TEXT_LENGTH) {
    throw new Error(`World objective must be at most ${PLAYER_TEXT_LENGTH} characters.`);
  }
  if (!Number.isSafeInteger(world.maxTurns) || world.maxTurns < 1 || world.maxTurns > 200) {
    throw new Error("World maxTurns must be an integer from 1 to 200.");
  }
  if (!isRecord(world.rooms)) throw new Error("World requires rooms.");
  if (!hasOwn(world.rooms, world.start)) throw new Error("World start room does not exist.");
  if (!isRecord(world.actions)) throw new Error("World requires actions.");
  if (!isRecord(world.endings)) throw new Error("World requires endings.");
  if (!hasOwn(world.endings, "timeout") || typeof world.endings.timeout !== "object") {
    throw new Error("World requires a timeout ending.");
  }

  for (const [roomId, room] of Object.entries(world.rooms)) {
    if (roomId.trim().length === 0) {
      throw new Error("Room identifier must not be blank.");
    }
    if (roomId.length > PLAYER_LABEL_LENGTH) {
      throw new Error(
        `Room ${roomId} identifier must be at most ${PLAYER_LABEL_LENGTH} characters.`,
      );
    }
    if (
      !isRecord(room) ||
      typeof room.title !== "string" ||
      room.title.trim().length === 0 ||
      typeof room.text !== "string" ||
      room.text.trim().length === 0
    ) {
      throw new Error(`Room ${roomId} requires title and text.`);
    }
    if (room.title.length > PLAYER_LABEL_LENGTH) {
      throw new Error(
        `Room ${roomId} title must be at most ${PLAYER_LABEL_LENGTH} characters.`,
      );
    }
    if (room.text.length > PLAYER_TEXT_LENGTH) {
      throw new Error(`Room ${roomId} text must be at most ${PLAYER_TEXT_LENGTH} characters.`);
    }
    if (!Array.isArray(room.actions)) throw new Error(`Room ${roomId} requires actions.`);
    if (room.actions.length === 0) {
      throw new Error(`Room ${roomId} requires at least one action.`);
    }
    if (new Set(room.actions).size !== room.actions.length) {
      throw new Error(`Room ${roomId} action list contains duplicates.`);
    }
    for (const actionId of room.actions) {
      if (!hasOwn(world.actions, actionId)) {
        throw new Error(`Room ${roomId} names unknown action ${actionId}.`);
      }
    }
  }

  const conditionKeys = new Set(["has", "lacks", "flag", "notFlag", "any", "all"]);
  const simpleConditionKeys = new Set(["has", "lacks", "flag", "notFlag"]);
  if (world.items !== undefined && !isRecord(world.items)) {
    throw new Error("World items must be an object.");
  }
  const itemIds = new Set(Object.keys(world.items ?? {}));
  for (const itemId of itemIds) {
    if (itemId.trim().length === 0) {
      throw new Error("Item identifier must not be blank.");
    }
    if (itemId.length > PLAYER_LABEL_LENGTH) {
      throw new Error(
        `Item ${itemId} identifier must be at most ${PLAYER_LABEL_LENGTH} characters.`,
      );
    }
  }
  const validCompound = (value) =>
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((nested) => {
      const nestedKeys = Object.keys(nested ?? {});
      if (nestedKeys.length !== 1) return false;
      const nestedKey = nestedKeys[0];
      if (simpleConditionKeys.has(nestedKey)) {
        if (typeof nested[nestedKey] !== "string") return false;
        return nestedKey === "has" || nestedKey === "lacks"
          ? itemIds.has(nested[nestedKey])
          : nested[nestedKey].trim().length > 0;
      }
      if (nestedKey === "any" || nestedKey === "all") return validCompound(nested[nestedKey]);
      return false;
    });
  const effectKeys = new Set([
    "move",
    "take",
    "remove",
    "flag",
    "unflag",
    "score",
    "end",
    "remember",
  ]);

  for (const [actionId, action] of Object.entries(world.actions)) {
    if (
      !isRecord(action) ||
      typeof action.label !== "string" ||
      action.label.trim().length === 0 ||
      !Array.isArray(action.effects) ||
      action.effects.length === 0
    ) {
      throw new Error(`Action ${actionId} requires label and effects.`);
    }
    if (action.label.length > PLAYER_LABEL_LENGTH) {
      throw new Error(
        `Action ${actionId} labels must be at most ${PLAYER_LABEL_LENGTH} characters.`,
      );
    }
    if (action.text !== undefined && typeof action.text !== "string") {
      throw new Error(`Action ${actionId} text must be a string.`);
    }
    if (action.text !== undefined && action.text.trim().length === 0) {
      throw new Error(`Action ${actionId} text must not be blank.`);
    }
    if (action.text !== undefined && action.text.length > PLAYER_TEXT_LENGTH) {
      throw new Error(
        `Action ${actionId} text must be at most ${PLAYER_TEXT_LENGTH} characters.`,
      );
    }
    if (action.beforeLastTurn !== undefined && typeof action.beforeLastTurn !== "boolean") {
      throw new Error(`Action ${actionId} beforeLastTurn must be a boolean.`);
    }
    if (action.when !== undefined && !Array.isArray(action.when)) {
      throw new Error(`Action ${actionId} when must be an array.`);
    }
    for (const condition of action.when ?? []) {
      if (!condition || typeof condition !== "object" || Array.isArray(condition)) {
        throw new Error(`Action ${actionId} has an invalid condition.`);
      }
      const keys = Object.keys(condition);
      if (keys.length !== 1 || !conditionKeys.has(keys[0])) {
        throw new Error(`Action ${actionId} has an invalid condition.`);
      }
      if (keys[0] === "any" || keys[0] === "all") {
        if (!validCompound(condition[keys[0]])) {
          throw new Error(`Action ${actionId} has an invalid condition.`);
        }
      } else if (typeof condition[keys[0]] !== "string") {
        throw new Error(`Action ${actionId} condition values must be strings.`);
      } else if (
        (keys[0] === "has" || keys[0] === "lacks") &&
        !itemIds.has(condition[keys[0]])
      ) {
        throw new Error(`Action ${actionId} condition references unknown item.`);
      } else if (
        (keys[0] === "flag" || keys[0] === "notFlag") &&
        condition[keys[0]].trim().length === 0
      ) {
        throw new Error(`Action ${actionId} condition ${keys[0]} must not be blank.`);
      }
    }
    for (const effect of action.effects) {
      if (!effect || typeof effect !== "object" || Array.isArray(effect)) {
        throw new Error(`Action ${actionId} has an invalid effect.`);
      }
      const keys = Object.keys(effect);
      if (keys.length !== 1 || !effectKeys.has(keys[0])) {
        throw new Error(`Action ${actionId} has an invalid effect.`);
      }
      if (effect.move !== undefined && !hasOwn(world.rooms, effect.move)) {
        throw new Error(`Action ${actionId} moves to unknown room ${effect.move}.`);
      }
      if (effect.end !== undefined && !hasOwn(world.endings, effect.end)) {
        throw new Error(`Action ${actionId} names unknown ending ${effect.end}.`);
      }
      if (
        (effect.take !== undefined || effect.remove !== undefined) &&
        !itemIds.has(effect.take ?? effect.remove)
      ) {
        throw new Error(`Action ${actionId} references unknown item.`);
      }
      if (effect.score !== undefined && !Number.isSafeInteger(effect.score)) {
        throw new Error(`Action ${actionId} score effects must be safe integers.`);
      }
      for (const key of ["move", "take", "remove", "flag", "unflag", "end", "remember"]) {
        if (effect[key] !== undefined && typeof effect[key] !== "string") {
          throw new Error(`Action ${actionId} effect ${key} must be a string.`);
        }
      }
      for (const key of ["flag", "unflag"]) {
        if (effect[key] !== undefined && effect[key].trim().length === 0) {
          throw new Error(`Action ${actionId} effect ${key} must not be blank.`);
        }
      }
      if (typeof effect.remember === "string" && effect.remember.length > PLAYER_FACT_LENGTH) {
        throw new Error(
          `Action ${actionId} remember facts must be at most ${PLAYER_FACT_LENGTH} characters.`,
        );
      }
      if (
        effect.remember !== undefined &&
        typeof effect.remember === "string" &&
        effect.remember.trim().length === 0
      ) {
        throw new Error(`Action ${actionId} remember facts must not be blank.`);
      }
    }
  }

  for (const [roomId, room] of Object.entries(world.rooms)) {
    const labels = room.actions.map((actionId) => world.actions[actionId].label);
    if (new Set(labels).size !== labels.length) {
      throw new Error(`Room ${roomId} action list contains duplicate labels.`);
    }
  }

  for (const [endingId, ending] of Object.entries(world.endings)) {
    if (endingId.trim().length === 0) {
      throw new Error("Ending identifier must not be blank.");
    }
    if (endingId.length > PLAYER_LABEL_LENGTH) {
      throw new Error(
        `Ending ${endingId} identifier must be at most ${PLAYER_LABEL_LENGTH} characters.`,
      );
    }
    if (
      !isRecord(ending) ||
      typeof ending.title !== "string" ||
      ending.title.trim().length === 0 ||
      typeof ending.text !== "string" ||
      ending.text.trim().length === 0
    ) {
      throw new Error(`Ending ${endingId} requires title and text.`);
    }
    if (ending.title.length > PLAYER_LABEL_LENGTH) {
      throw new Error(
        `Ending ${endingId} title must be at most ${PLAYER_LABEL_LENGTH} characters.`,
      );
    }
    if (ending.text.length > PLAYER_TEXT_LENGTH) {
      throw new Error(
        `Ending ${endingId} text must be at most ${PLAYER_TEXT_LENGTH} characters.`,
      );
    }
  }

  if (
    !Array.isArray(world.winningPlan) ||
    world.winningPlan.length === 0 ||
    world.winningPlan.some((id) => !hasOwn(world.actions, id))
  ) {
    throw new Error("World winningPlan must contain known action IDs.");
  }
  try {
    const planned = replayActions(world, 1, world.winningPlan);
    if (planned.state.ending !== "beacon") {
      throw new Error(`ended as ${planned.state.ending ?? "incomplete"}`);
    }
  } catch (error) {
    throw new Error(`World winningPlan must replay to beacon: ${error.message}`);
  }
  return world;
}

export function createState(world, seed = 1) {
  if (!Number.isSafeInteger(seed)) throw new Error("Seed must be a safe integer.");
  return Object.freeze({
    seed,
    room: world.start,
    inventory: Object.freeze([]),
    flags: Object.freeze([]),
    journal: Object.freeze([]),
    score: 0,
    turn: 0,
    ended: false,
    ending: null,
  });
}

function conditionHolds(condition, state) {
  if (condition.any !== undefined) return condition.any.some((nested) => conditionHolds(nested, state));
  if (condition.all !== undefined) return condition.all.every((nested) => conditionHolds(nested, state));
  if (condition.has !== undefined) return state.inventory.includes(condition.has);
  if (condition.lacks !== undefined) return !state.inventory.includes(condition.lacks);
  if (condition.flag !== undefined) return state.flags.includes(condition.flag);
  if (condition.notFlag !== undefined) return !state.flags.includes(condition.notFlag);
  throw new Error(`Unknown condition: ${JSON.stringify(condition)}`);
}

export function legalActions(world, state) {
  if (state.ended) return [];
  let available = world.rooms[state.room].actions.filter((actionId) => {
    const action = world.actions[actionId];
    if (action.beforeLastTurn === true && state.turn >= world.maxTurns - 1) return false;
    return (action.when ?? []).every((condition) => conditionHolds(condition, state));
  });
  const isLastTurn = state.turn === world.maxTurns - 1;
  const beaconFinishers = isLastTurn
    ? available.filter((actionId) =>
        world.actions[actionId].effects.some((effect) => effect.end === "beacon"),
      )
    : [];
  if (isLastTurn && beaconFinishers.length === 0 && world.actions.leave_island) {
    if (!available.includes("leave_island")) available = [...available, "leave_island"];
  }
  if (beaconFinishers.length > 0) {
    const otherActions = available.filter((actionId) => !beaconFinishers.includes(actionId));
    return [...beaconFinishers, ...otherActions];
  }
  return available;
}

function sorted(values) {
  return [...values].sort();
}

function capitalizeFirst(value) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

function actionEvent(world, state, actionId) {
  const action = world.actions[actionId];
  if (
    actionId === "enter_house" &&
    state.inventory.includes("lantern") &&
    state.flags.includes("mooring_return_used") &&
    state.flags.includes("mooring_secured")
  ) {
    return state.flags.includes("boat_signaled")
      ? "Mooring is secure; the boat will hold."
      : "Mooring is secure; the boat will hold. From the keeper's room, signal the boat for a confirmed channel if desired.";
  }
  if (
    actionId === "enter_house" &&
    state.inventory.includes("lantern") &&
    state.flags.includes("mooring_return_used") &&
    !state.flags.includes("mooring_secured")
  ) {
    return "Door opens. Mooring unsecured; the recovery return was used without securing it, so the boat may not hold. Continue with the basic beacon route.";
  }
  if (actionId === "enter_house" && state.inventory.includes("lantern")) {
    if (state.flags.includes("mooring_secured")) {
      return state.flags.includes("boat_signaled")
        ? "Door opens. Mooring is secure; the boat will hold. Signal already confirmed its hold; radio checks confirm the channel if desired."
        : "Door opens. Mooring is secure; the boat will hold; no return is needed. Next step (optional): signal the boat from the keeper's room for a confirmed channel. For reference, general status rule: if mooring unsecured, boat may not hold; once secure, boat holds.";
    }
    const enteredState = { ...state, room: "keeper_room" };
    const canReturnNow = legalActions(world, enteredState).includes("return_for_mooring");
    if (canReturnNow) {
      return "Door opens. If mooring unsecured, boat may not hold; once secure, boat holds. Return to the jetty to secure it before lighting.";
    }

    const hasLog = state.flags.includes("read_log");
    const hasOil = state.inventory.includes("oil");
    const canTakeOil = legalActions(world, enteredState).includes("take_oil");
    const setupFlags = hasLog ? state.flags : [...state.flags, "read_log"];
    const setupInventory = !hasOil && canTakeOil ? [...state.inventory, "oil"] : state.inventory;
    const canReturnAfterSetup = legalActions(world, {
      ...enteredState,
      flags: setupFlags,
      inventory: setupInventory,
    }).includes("return_for_mooring");
    if (canReturnAfterSetup) {
      const setup = [];
      if (!hasLog) setup.push("read the wall log");
      if (!hasOil) setup.push("take the oil");
      return `Door opens. If mooring unsecured, boat may not hold; once secure, boat holds. ${capitalizeFirst(setup.join(" and "))}; then return to the jetty to secure it before lighting.`;
    }
    return "Door opens. Mooring unsecured; the recovery return is no longer available, so continue with the basic beacon route.";
  }
  if (actionId === "secure_mooring") {
    return "Mooring secure: the boat will hold without signaling; stronger rescue on its own. Basic rescue: signaling is optional for a basic rescue—skip signaling and light for the boat directly. Stronger channel route: later, signal the boat from the keeper's room (enter the keeper's room first); radio checks confirm the channel. Keeper-room menu offers the choice: use \"Signal the secured boat to hold position\" to confirm its hold.";
  }
  if (actionId === "read_log") {
    const fuseInstalled = state.flags.includes("fuse_installed");
    const lanternFilled = state.flags.includes("lantern_filled");
    if (fuseInstalled && lanternFilled) {
      return "The wall log confirms the required sequence: the fuse is replaced and the lantern filled; light the beacon. Optional tuning: trim the wick or align the lens before lighting; tune both for the strongest rescue beam. A confirmed channel earns the strongest rescue outcome.";
    }
    if (fuseInstalled) {
      return "The wall log confirms the required sequence: the fuse is already replaced; fill the hand lantern, then light the beacon. Optional tuning: trim the wick or align the lens before lighting; tune both for the strongest rescue beam. A confirmed channel earns the strongest rescue outcome.";
    }
    if (lanternFilled) {
      return "The wall log confirms the required sequence: the lantern is already filled; replace the fuse, then light the beacon. Optional tuning: trim the wick or align the lens before lighting; tune both for the strongest rescue beam. A confirmed channel earns the strongest rescue outcome.";
    }
    return "The wall log sets the required sequence: replace the fuse, fill the hand lantern, then light the beacon. Optional tuning: trim the wick or align the lens before lighting; tune both for the strongest rescue beam. A confirmed channel earns the strongest rescue outcome.";
  }
  if (actionId === "signal_boat") {
    if (
      state.inventory.includes("oil") ||
      state.flags.includes("lantern_filled") ||
      state.flags.includes("radio_checked")
    ) {
      const pendingClues = [];
      if (!state.flags.includes("read_log")) pendingClues.push("read the wall log");
      if (!state.flags.includes("tide_chart_read")) pendingClues.push("study the tide chart");
      if (pendingClues.length > 0) {
        return `Ring the bell; supply boat holds position. ${capitalizeFirst(pendingClues.join(" and "))} before climbing.`;
      }
      return "Ring the bell; supply boat holds position.";
    }
    const hasLog = state.flags.includes("read_log");
    const hasTide = state.flags.includes("tide_chart_read");
    if (hasLog && hasTide) {
      return "Ring the bell; supply boat holds position. Check the storm radio before taking oil.";
    }
    if (hasLog) return "Boat holds. Study the tide chart now to unlock the storm radio: make the storm radio available. If you want the keeper-room confirmation, then check it before taking oil (costs one turn). The check choice appears after the tide chart. Keeper-room radio check optional; tower relay later if you skip the check (to confirm the channel), after filling the lantern in the tower: in the lantern room, choose Check the tower relay for a clear channel.";
    if (hasTide) return "Ring the bell; supply boat holds position. Read the log before checking the storm radio.";
    return "Ring the bell; supply boat holds position. Read the log and tide chart before checking the storm radio.";
  }
  if (
    actionId === "study_tide_chart" &&
    state.flags.includes("boat_signaled") &&
    state.flags.includes("read_log") &&
    !state.inventory.includes("oil") &&
    !state.flags.includes("radio_checked")
  ) {
    return state.flags.includes("lantern_filled")
      ? "Safe window for a stronger rescue: light the beacon before the next high tide. Storm radio is now available; check it if time allows (costs one turn)."
      : "Safe window for a stronger rescue: light the beacon before the next high tide. Storm radio is now available; check it before taking oil (costs one turn).";
  }
  if (actionId === "check_tower_radio") {
    if (state.flags.includes("chronometer_wound") && state.flags.includes("tide_waited")) {
      return "Channel is clear; confirmed channel earns the strongest rescue. Finish beam tuning if needed; use confirmed-channel rescue beacon. Check before the last turn; costs a turn. Bar storm shutters before this check if needed: close for a sheltered finish.";
    }
    return "Channel is clear; this enables the strongest rescue outcome. Finish beam tuning if needed; use confirmed-channel rescue beacon. Check before the last turn; costs a turn.";
  }
  if (actionId === "go_workshop" && !state.flags.includes("fuse_installed")) {
    return "Workshop beside the keeper's room; current is not restored; take and install the switchboard fuse, then use the service ladder.";
  }
  if (actionId === "return_keeper_from_workshop") {
    const missingSupplies = [];
    if (!state.inventory.includes("lantern")) missingSupplies.push("the lantern");
    if (!state.inventory.includes("oil") && !state.flags.includes("lantern_filled")) {
      missingSupplies.push("oil");
    }
    if (state.flags.includes("fuse_installed")) {
      const keeperState = { ...state, room: "keeper_room" };
      const hasKeeperPrep = [
        "read_log",
        "study_tide_chart",
        "signal_boat",
        "wind_chronometer",
        "check_storm_radio",
        "return_for_mooring",
      ].some((prepAction) => legalActions(world, keeperState).includes(prepAction));
      if (missingSupplies.length) {
        return `Current is already restored; Take ${missingSupplies.join(" and ")} if needed, then use the repaired stair to reach the tower.`;
      }
      return hasKeeperPrep
        ? "Current is already restored. Finish any keeper-room prep, then use the repaired stair to reach the tower."
        : "Current is already restored. Then use the repaired stair to reach the tower.";
    }
    const supplyCue = missingSupplies.length
      ? `Take ${missingSupplies.join(" and ")} if needed, then return`
      : "Return";
    return `Tower work remains ahead—workshop stays behind. ${supplyCue} to the workshop to take and install the fuse before using the repaired stair.`;
  }
  if (actionId === "return_keeper_for_lantern") {
    return state.inventory.includes("oil")
      ? "You descend to the keeper's room; go to the jetty for the missing lantern, then return to the repaired stair."
      : "You descend to the keeper's room; go to the jetty for the missing lantern and take oil before returning to the repaired stair.";
  }
  if (actionId === "return_keeper_after_repair") {
    const rescueCue = state.flags.includes("radio_checked")
      ? "Confirmed channel is already prepared."
      : state.flags.includes("mooring_secured")
        ? "Moored boat can still be rescued."
        : "The basic beacon route can still rescue the boat.";
    return `Emergency release sends you to the keeper's room. Take missing oil if needed; jetty return too if lantern's gone; use repaired stair. ${rescueCue}`;
  }
  if (actionId === "return_keeper_from_tower") {
    const rescueCue = state.flags.includes("mooring_secured")
      ? "Moored boat can still be rescued."
      : "The basic beacon route can still rescue the boat.";
    return state.inventory.includes("lantern")
      ? `Return for missing oil; collect it before returning to the tower. ${rescueCue}`
      : `Return for missing oil; if the lantern is missing too, collect both before returning to the tower. ${rescueCue}`;
  }
  if (actionId === "close_storm_shutters") {
    if (state.turn === world.maxTurns - 1) {
      return "Storm shutters barred too late; no turn remains to light the beacon.";
    }
    return state.flags.includes("wick_trimmed") && state.flags.includes("lens_aligned")
      ? "Storm shutters barred; beam tuning is complete. The sheltered finish is ready."
      : "Bar storm shutters. Finish remaining trim or alignment before another turn; the beam holds through rescue.";
  }
  if (
    actionId === "climb_tower" &&
    state.flags.includes("radio_checked") &&
    state.flags.includes("chronometer_wound")
  ) {
    return "Unpowered stair: switchboard still needs repair below. The confirmed channel is already prepared; fill the lantern, return to install the fuse, then climb again.";
  }
  if (
    actionId === "climb_tower" &&
    state.flags.includes("radio_checked") &&
    state.flags.includes("tower_return_used")
  ) {
    return "Unpowered stair: switchboard still needs repair below. The confirmed channel is already prepared; fill the lantern, return to install the fuse, then climb again.";
  }
  if (actionId === "climb_tower" && state.flags.includes("chronometer_wound")) {
    return "Unpowered stair: switchboard still needs repair below. Fill the lantern if you have oil; return to install the fuse. Chronometer already wound for the precision rescue.";
  }
  if (actionId === "climb_tower" && state.flags.includes("tower_return_used")) {
    return "Unpowered stair: switchboard still needs repair below. Fill the lantern if you have oil; return to install the fuse. Early chronometer timing is no longer available after the repair return.";
  }
  if (actionId === "climb_tower" && state.flags.includes("radio_checked")) {
    return "Unpowered stair: switchboard still needs repair below. The confirmed channel is already prepared; fill the lantern, return to install the fuse, then climb again.";
  }
  if (
    actionId === "climb_tower" &&
    !state.flags.includes("chronometer_wound") &&
    !state.flags.includes("tower_return_used")
  ) {
    const missingPreparation = [];
    if (!state.flags.includes("read_log")) missingPreparation.push("read the wall log");
    if (!state.flags.includes("tide_chart_read")) missingPreparation.push("study the tide chart");
    if (!state.flags.includes("boat_signaled")) {
      missingPreparation.push(
        state.flags.includes("mooring_secured") ? "signal the boat" : "secure and signal the boat",
      );
    }
    if (missingPreparation.length > 0) {
      return `Unpowered stair: fill the lantern if you have oil; after filling, return to ${missingPreparation.join(", ")}, wind the chronometer, then repair the switchboard before climbing again.`;
    }
  }
  if (
    actionId === "return_keeper_after_fill" &&
    state.flags.includes("lantern_filled") &&
    state.flags.includes("radio_checked")
  ) {
    return "Lantern already filled; return to the workshop, install the fuse, then climb again. Confirmed channel is already prepared.";
  }
  if (actionId === "return_keeper_after_fill" && state.flags.includes("lantern_filled")) {
    return state.flags.includes("chronometer_wound")
      ? "Lantern already filled; return to the workshop, install the fuse, then climb again. Chronometer timing is already prepared."
      : "Lantern already filled; return to the workshop, install the fuse, then climb again. This repair return closes early chronometer timing.";
  }
  if (actionId === "return_keeper_after_fill" && !state.flags.includes("lantern_filled")) {
    return state.flags.includes("chronometer_wound")
      ? "Descend before filling: switchboard still needs repair below. Return to the workshop, install the fuse, then climb again. Chronometer timing is already prepared."
      : "Descend before filling: switchboard still needs repair below. Return to the workshop, install the fuse, then climb again. This repair return closes early chronometer timing.";
  }
  if (actionId === "take_oil") {
    return "You take the sealed oil flask; fill the hand lantern before lighting, whether you climb now or later.";
  }
  if (actionId === "return_for_mooring") {
    return "You return to the jetty; secure the supply boat's mooring next.";
  }
  if (actionId === "fill_lantern" && state.flags.includes("fuse_installed")) {
    return "Hand lantern filled; small flame holds steady; beacon dark. Next: light the beacon. Each tuning step is an independent optional upgrade; optional choices: trim the wick or align the beacon lens; either works as an optional upgrade; tune both for rescue's strongest result.";
  }
  if (actionId === "wait_for_horn" && state.turn === world.maxTurns - 1) {
    return "Horn timing recorded too late; no turn remains to light the beacon.";
  }
  if (actionId === "wait_for_horn" && state.flags.includes("radio_checked")) {
    return "Spend one turn; horn bonus recorded. Confirmed channel is ready; use the confirmed-channel finish after tuning; light next turn; never wait on the last turn.";
  }
  if (actionId === "wait_for_horn" && state.flags.includes("chronometer_wound")) {
    return "Spend one turn; horn bonus recorded. Chronometer timing is ready; use the chronometer-timed finish after tuning; light next turn; never wait on the last turn.";
  }
  if (
    actionId === "wait_for_horn" &&
    state.flags.includes("wick_trimmed") &&
    state.flags.includes("lens_aligned")
  ) {
    return "Spend one turn; the horn earns a small rescue bonus. Finish any trim or alignment before lighting if needed; the remaining turn matters. Beam tuning is complete—light next turn. Never wait on the last turn.";
  }
  if (actionId === "wait_for_horn") {
    if (state.flags.includes("read_log")) {
      return state.flags.includes("tide_chart_read")
        ? "Spend one turn; horn bonus recorded. With the wall log, use the marked-tide finish after tuning; light next turn; never wait on the last turn."
        : "Spend one turn; horn bonus recorded. With the wall log and no tide mark, use the tuned-beacon finish after tuning; light next turn; never wait on the last turn.";
    }
    return "Spend one turn; horn bonus recorded. Without the wall log, use the horn-timed finish after tuning if the tide mark is recorded; light next turn; never wait on the last turn.";
  }
  if (actionId === "trim_wick" && state.flags.includes("lens_aligned")) {
    return "Clean, steady flame.";
  }
  if (actionId === "trim_wick") {
    return "Clean, steady flame; lens remains unaligned. Align the beacon lens before lighting for the strongest rescue, or light the trimmed beacon now.";
  }
  if (actionId === "align_lens" && state.flags.includes("wick_trimmed")) {
    return "Beam will hold true.";
  }
  if (actionId === "align_lens") {
    return "Beam will hold true. Trim the wick now for the strongest rescue beam; a confirmed channel earns the strongest rescue outcome; otherwise light the aligned beacon.";
  }
  if (
    actionId === "climb_service_ladder" &&
    state.inventory.includes("lantern") &&
    (state.inventory.includes("oil") || state.flags.includes("lantern_filled"))
  ) {
    return "Current restored; you climb the service ladder to the tower and reach the lantern room.";
  }
  if (
    actionId === "climb_service_ladder" &&
    state.inventory.includes("lantern") &&
    !state.inventory.includes("oil") &&
    !state.flags.includes("lantern_filled")
  ) {
    return "Current restored; you climb the service ladder to the tower with the lantern, but oil is missing; return below to fetch oil before filling.";
  }
  if (
    actionId === "climb_service_ladder" &&
    !state.inventory.includes("lantern") &&
    state.inventory.includes("oil") &&
    !state.flags.includes("lantern_filled")
  ) {
    return "Current restored; you climb the service ladder to the tower with oil, but the lantern is missing; return below to fetch the lantern before filling.";
  }
  if (actionId === "climb_repaired_stairs" && state.flags.includes("lantern_filled")) {
    return "Repaired stair to lantern room; lantern already filled; continue the beacon work above.";
  }
  return action.text ?? action.label;
}

export function step(world, state, actionId) {
  if (state.ended) return { ok: false, state, error: "The game has ended.", event: null };
  if (!legalActions(world, state).includes(actionId)) {
    return {
      ok: false,
      state,
      error: `Action ${JSON.stringify(actionId)} is not legal now.`,
      event: null,
    };
  }

  const action = world.actions[actionId];
  const inventory = new Set(state.inventory);
  const flags = new Set(state.flags);
  const journal = new Set(state.journal);
  let room = state.room;
  let score = state.score;
  let ending = null;

  for (const effect of action.effects) {
    if (effect.move !== undefined) room = effect.move;
    else if (effect.take !== undefined) inventory.add(effect.take);
    else if (effect.remove !== undefined) inventory.delete(effect.remove);
    else if (effect.flag !== undefined) flags.add(effect.flag);
    else if (effect.unflag !== undefined) flags.delete(effect.unflag);
    else if (effect.remember !== undefined) journal.add(effect.remember);
    else if (effect.score !== undefined) score += effect.score;
    else if (effect.end !== undefined) ending = effect.end;
    else throw new Error(`Unknown effect in ${actionId}: ${JSON.stringify(effect)}`);
  }

  const turn = state.turn + 1;
  if (ending === null && turn >= world.maxTurns) ending = "timeout";

  const next = Object.freeze({
    seed: state.seed,
    room,
    inventory: Object.freeze(sorted(inventory)),
    flags: Object.freeze(sorted(flags)),
    journal: Object.freeze(sorted(journal)),
    score,
    turn,
    ended: ending !== null,
    ending,
  });
  return { ok: true, state: next, error: null, event: actionEvent(world, state, actionId) };
}

function endingView(world, state) {
  const ending = world.endings[state.ending];
  if (state.ending !== "beacon") return [state.ending, ending.title, ending.text];

  const tuned = state.flags.includes("wick_trimmed") && state.flags.includes("lens_aligned");
  const preparedChannel =
    state.flags.includes("mooring_secured") || state.flags.includes("boat_signaled");
  const precisionChannel =
    state.flags.includes("radio_checked") ||
    (state.flags.includes("chronometer_wound") && state.flags.includes("tide_waited"));
  const detail = precisionChannel
    ? "The tuned channel earns the strongest rescue."
    : tuned && preparedChannel
      ? "The tuned beam and prepared channel earn a stronger rescue."
      : tuned || preparedChannel
        ? "Optional preparation earns a stronger rescue."
        : "The beacon is relit without optional preparation.";

  return [state.ending, ending.title, `${ending.text} ${detail}`];
}

export function observation(world, state, event = null) {
  const room = world.rooms[state.room];
  const availableActions = legalActions(world, state);
  const hasLastTurnBeaconFinisher =
    state.turn === world.maxTurns - 1 &&
    availableActions.some((id) =>
      world.actions[id].effects.some((effect) => effect.end === "beacon"),
    );
  const hasBeaconFinisher = availableActions.some((id) =>
    world.actions[id].effects.some((effect) => effect.end === "beacon"),
  );
  let roomText = room.text;
  if (state.room === "tower") {
    if (state.turn < world.maxTurns - 1) {
      roomText = roomText.replace(
        "Last turn: light now.",
        hasBeaconFinisher
          ? "Before the final turn: light when ready; remaining preparation is optional."
          : "Before the final turn: finish the remaining preparation.",
      );
    }
    const logTideStatus =
      state.flags.includes("read_log") && state.flags.includes("tide_chart_read")
        ? "Log and tide chart are recorded;"
        : state.flags.includes("read_log")
          ? "Wall log recorded; tide chart pending;"
          : state.flags.includes("tide_chart_read")
            ? "Tide chart recorded; wall log pending;"
            : "Wall log and tide chart are pending;";
    roomText = roomText.replace("Log and tide chart are recorded;", logTideStatus);
    const tuningStatus =
      state.flags.includes("lens_aligned") && !state.flags.includes("wick_trimmed")
        ? "Lens aligned; trim the wick before lighting if desired, or light the aligned beacon."
        : state.flags.includes("wick_trimmed") && !state.flags.includes("lens_aligned")
          ? "Wick trimmed; align the beacon lens before lighting if desired, or light the clean flame."
          : null;
    if (tuningStatus !== null) {
      roomText = roomText.replace(
        "Aligned by hand if needed; charred wick can be trimmed before lighting the beacon if needed.",
        tuningStatus,
      );
    }
    if (state.flags.includes("radio_checked")) {
      roomText = roomText.replace(
        "tower relay can confirm the radio channel after the lantern is filled if needed.",
        "Radio channel already confirmed;",
      );
    }
    if (state.flags.includes("shutters_closed")) {
      roomText = roomText.replace(
        "Bar shutters: sheltered finish",
        "Shutters barred: sheltered finish ready",
      );
    } else if (hasLastTurnBeaconFinisher) {
      roomText = roomText.replace(
        "Bar shutters: sheltered finish",
        "Sheltered finish is too late; light now.",
      );
    }
    if (state.flags.includes("wick_trimmed") && state.flags.includes("lens_aligned")) {
      roomText = roomText.replace(
        "Finish any trim or alignment before spending a turn to wait.",
        state.turn === world.maxTurns - 1
          ? "Beam tuning is complete; light now."
          : availableActions.includes("wait_for_horn")
            ? "Beam tuning is complete; light now or wait for the horn if time allows."
            : "Beam tuning is complete; light the beacon when ready.",
      );
    } else if (state.flags.includes("tide_waited")) {
      roomText = roomText.replace(
        "Finish any trim or alignment before spending a turn to wait.",
        hasLastTurnBeaconFinisher
          ? "Horn timing is recorded; light the available rescue beacon now; remaining tuning is optional."
          : "Horn timing is recorded; finish the remaining beam tuning before lighting.",
      );
    } else if (hasLastTurnBeaconFinisher) {
      roomText = roomText.replace(
        "Finish any trim or alignment before spending a turn to wait.",
        "A beacon finish is ready; light now; remaining tuning is optional.",
      );
    } else if (!availableActions.includes("wait_for_horn")) {
      roomText = roomText.replace(
        "Finish any trim or alignment before spending a turn to wait.",
        "Finish any trim or alignment before lighting.",
      );
    }
  } else if (state.room === "keeper_room") {
    const clueStatus =
      state.flags.includes("read_log") && state.flags.includes("tide_chart_read")
        ? "Log and tide clues are recorded."
        : state.flags.includes("read_log")
          ? "Wall log recorded; read the tide chart."
          : state.flags.includes("tide_chart_read")
            ? "Tide chart recorded; read the wall log."
          : null;
    if (clueStatus !== null) roomText = roomText.replace("Read remaining clues.", clueStatus);
    if (state.flags.includes("mooring_return_used") && !state.flags.includes("mooring_secured")) {
      roomText = roomText.replace(
        "Signal the boat first if needed; check radio if needed before taking the oil;",
        "Mooring is unsecured; use the basic beacon route;",
      );
    } else if (state.flags.includes("radio_checked")) {
      roomText = roomText.replace(
        "check radio if needed before taking the oil;",
        state.inventory.includes("oil")
          ? "Radio channel already confirmed; check radio if needed; oil is ready; fill the lantern before climbing;"
          : state.flags.includes("lantern_filled")
          ? "Radio channel already confirmed;"
          : "Radio channel already confirmed; take the oil when ready;",
      );
    } else if (state.inventory.includes("oil") && !state.flags.includes("radio_checked")) {
      roomText = roomText.replace(
        "check radio if needed before taking the oil;",
        "Oil is ready; fill the lantern before climbing;",
      );
    } else if (state.flags.includes("lantern_filled")) {
      const radioStatus = state.flags.includes("radio_checked")
        ? "Radio channel already confirmed;"
        : availableActions.includes("check_storm_radio")
          ? "Lantern filled; check the radio now if time allows;"
          : "Lantern filled; radio check can wait until the boat and clues are ready;";
      roomText = roomText.replace(
        "check radio if needed before taking the oil;",
        radioStatus,
      );
    }
    if (state.flags.includes("mooring_secured")) {
      roomText = roomText.replace(
        "If unsecured: read the log, take oil, then return to secure the mooring before studying tide.",
        "Mooring is secure; the boat will hold.",
      );
    } else if (
      state.flags.includes("read_log") ||
      state.flags.includes("tide_chart_read") ||
      state.inventory.includes("oil")
    ) {
      const hasReadLog = state.flags.includes("read_log");
      const hasTideChart = state.flags.includes("tide_chart_read");
      const mooringStatus = state.flags.includes("mooring_secured")
        ? "Mooring is secure; the boat will hold."
        : state.flags.includes("mooring_return_used")
          ? "Mooring recovery was used without securing; continue with the basic beacon route."
          : !state.inventory.includes("lantern") && availableActions.includes("go_jetty")
            ? hasReadLog
              ? "Mooring is unsecured; recover the lantern, then secure the boat before lighting."
              : "Mooring is unsecured; recover the lantern and read the wall log, then secure the boat before lighting."
            : availableActions.includes("return_for_mooring")
              ? hasTideChart
                ? "Mooring is unsecured; return to secure it before lighting."
                : state.inventory.includes("oil")
                  ? "Mooring is unsecured; return to secure it before studying the tide."
                : "Mooring is unsecured; take oil if needed, then return to secure it before studying the tide."
              : !hasReadLog && availableActions.includes("read_log")
                ? "Mooring is unsecured; read the wall log before securing the boat or lighting."
              : hasTideChart && !hasReadLog
                ? "Mooring is unsecured; read the wall log before securing the boat or lighting."
                : availableActions.includes("take_oil")
                  ? "Mooring is unsecured; take oil, then return to secure it before studying the tide."
              : "Mooring recovery is no longer available; continue with the basic beacon route.";
      roomText = roomText.replace(
        "If unsecured: read the log, take oil, then return to secure the mooring before studying tide.",
        mooringStatus,
      );
    }
  } else if (state.room === "workshop" && state.flags.includes("fuse_installed")) {
    const missingSupplies =
      !state.inventory.includes("lantern") && !state.flags.includes("lantern_filled") ||
      !state.inventory.includes("oil") && !state.flags.includes("lantern_filled");
    const canReturnForSupplies =
      availableActions.includes("return_keeper_after_repair") ||
      availableActions.includes("return_keeper_from_workshop");
    const installedGuidance = missingSupplies && canReturnForSupplies
      ? "The fuse is installed; return to the keeper's room for missing supplies before climbing; "
      : state.inventory.includes("lantern") &&
          (state.inventory.includes("oil") || state.flags.includes("lantern_filled"))
        ? "The fuse is installed; supplies are ready—climb the service ladder; "
        : "The fuse is installed; climb the service ladder; ";
    roomText = roomText.replace(
      "If you already carry both lantern and oil, install the fuse instead of backtracking; after installation, climb the service ladder; ",
      installedGuidance,
    );
  } else if (state.room === "jetty" && state.flags.includes("mooring_secured")) {
    roomText = roomText.replace(
      "secure the line before entering if you want the boat to hold while you work.",
      "the mooring is secure; enter when ready—the boat will hold while you work.",
    );
  }
  const beaconFinishers =
    state.turn === world.maxTurns - 1
      ? availableActions.filter((id) =>
          world.actions[id].effects.some((effect) => effect.end === "beacon"),
        )
      : [];
  if (state.room === "tower" && state.turn === world.maxTurns - 1) {
    const finalTuningCue =
      state.flags.includes("wick_trimmed") && state.flags.includes("lens_aligned")
        ? "Beam tuning is complete."
        : state.flags.includes("lens_aligned")
          ? "Lens aligned; remaining wick trim is too late."
          : state.flags.includes("wick_trimmed")
            ? "Wick trimmed; remaining lens alignment is too late."
            : "Remaining beam tuning is too late.";
    roomText = roomText
      .replace(
        "Aligned by hand if needed; charred wick can be trimmed before lighting the beacon if needed.",
        finalTuningCue,
      )
      .replace(
        "Lens aligned; trim the wick before lighting if desired, or light the aligned beacon.",
        finalTuningCue,
      )
      .replace(
        "Wick trimmed; align the beacon lens before lighting if desired, or light the clean flame.",
        finalTuningCue,
      );
    if (beaconFinishers.length === 1) {
      roomText = roomText.replace(
        "Several lighting choices; most preparation: sheltered confirmed-channel rescue/secured-boat tuned rescue at tide/horn-timed rescue/marked-tide rescue/perfectly timed/fully prepared.",
        "One beacon finish remains; light now.",
      );
    }
  }
  if (
    state.room === "tower" &&
    state.turn === world.maxTurns - 1 &&
    beaconFinishers.length === 0
  ) {
    roomText = roomText.replace(
      "Horn timing is recorded; finish the remaining beam tuning before lighting.",
      "Horn timing is recorded; no rescue remains; leave if possible.",
    );
    roomText = roomText.replace(
      "Beam tuning is complete; light now.",
      "Beam tuning is complete; no rescue remains; leave if possible.",
    );
    roomText = roomText.replace(
      "Last turn: light now.",
      "Last turn: no rescue remains; leave if possible.",
    );
    roomText = roomText.replace(
      "Several lighting choices; most preparation: sheltered confirmed-channel rescue/secured-boat tuned rescue at tide/horn-timed rescue/marked-tide rescue/perfectly timed/fully prepared. Bar shutters: sheltered finish",
      "No beacon finish remains.",
    );
    roomText = roomText.replace(
      "Several lighting choices; most preparation: sheltered confirmed-channel rescue/secured-boat tuned rescue at tide/horn-timed rescue/marked-tide rescue/perfectly timed/fully prepared. Shutters barred: sheltered finish ready",
      "No beacon finish remains.",
    );
  }
  if (state.room === "tower" && state.turn === world.maxTurns - 1) {
    roomText = roomText.replace(/; ([A-Z])/g, (_, letter) => `; ${letter.toLowerCase()}`);
  }
  const lastTurnExit =
    state.turn === world.maxTurns - 1 && beaconFinishers.length === 0
      ? availableActions.filter((id) => id === "leave_island")
      : [];
  const visibleActions =
    beaconFinishers.length > 0
      ? beaconFinishers
      : lastTurnExit.length > 0
        ? lastTurnExit
        : availableActions;
  const actions = visibleActions.map((id) => [
    id,
    id === "climb_tower" && state.flags.includes("radio_checked")
      ? "Climb the unpowered stair; confirmed channel is ready; fill the lantern, then repair the switchboard"
      : id === "climb_tower" && state.flags.includes("chronometer_wound")
      ? "Climb the unpowered stair; chronometer is already wound; fill the lantern, then repair the switchboard"
      : id === "climb_tower" && state.flags.includes("tower_return_used")
      ? "Climb the unpowered stair; early chronometer timing is closed; fill the lantern, then repair the switchboard"
      : id === "climb_tower" &&
          (!state.flags.includes("read_log") ||
            !state.flags.includes("tide_chart_read") ||
            !state.flags.includes("boat_signaled"))
      ? "Climb the unpowered stair; fill the lantern, then finish keeper preparation before repairing the switchboard"
      : id === "return_keeper_for_lantern" && state.inventory.includes("oil")
      ? "Descend to fetch the missing lantern; oil is already carried"
      : id === "return_keeper_from_tower" && state.inventory.includes("lantern")
      ? "Descend to fetch the missing oil; lantern is already carried"
      : id === "check_tower_radio" &&
          state.flags.includes("wick_trimmed") &&
          state.flags.includes("lens_aligned")
      ? "Check the tower relay; beam tuning is complete (costs one turn; before last turn only; never on last turn)"
      : id === "close_storm_shutters" &&
          state.flags.includes("wick_trimmed") &&
          state.flags.includes("lens_aligned")
      ? "Optional: close storm shutters for a sheltered finish (costs one turn; never on last turn; beam tuning is complete)"
      : id === "check_storm_radio" && state.flags.includes("lantern_filled")
      ? "Check the storm radio after filling (costs one turn)"
      : id === "wait_for_horn" && state.turn < world.maxTurns - 1
      ? "Wait for the horn; timing bonus; costs one turn; light next turn (never on last turn)"
      : id === "return_for_mooring" && state.flags.includes("tide_chart_read")
        ? "Return—secure the mooring before lighting; recovery remains open afterward"
      : id === "light_all_ready_beacon" &&
          state.flags.includes("tide_waited") &&
          (event !== null || state.turn < world.maxTurns - 1)
        ? "Light the tuned beacon with the horn bonus"
      : world.actions[id].label,
  ]);
  const payload = {
    at: [state.room, room.title],
    text: roomText,
    turn: [state.turn, world.maxTurns],
    score: state.score,
    ...(state.inventory.length ? { inv: state.inventory } : {}),
    ...(state.journal.length ? { facts: state.journal.slice(0, PLAYER_FACT_LIMIT) } : {}),
    ...(event ? { event } : {}),
    ...(actions.length ? { actions } : {}),
  };
  if (state.ended) {
    payload.end = endingView(world, state);
  }
  return payload;
}

/**
 * The model receives labels indexed from zero. It never receives a tool name,
 * session ID, revision, stable action ID, raw flag, or raw state object.
 */
export function modelTurnInput(world, view) {
  const isLastTurn =
    Array.isArray(view.turn) &&
    view.turn.length === 2 &&
    view.turn[0] === view.turn[1] - 1;
  let modelText = view.text;
  const visibleFacts = Array.isArray(view.facts) ? view.facts : [];
  const visibleInventory = Array.isArray(view.inv) ? view.inv : [];
  const visibleActionIds = new Set((view.actions ?? []).map(([id]) => id));
  const hasBeaconFinish = (view.actions ?? []).some(([id]) =>
    world.actions[id]?.effects.some((effect) => effect.end === "beacon"),
  );
  if (typeof modelText === "string") {
    if (visibleFacts.some((fact) => /Hand lantern filled; beacon remains dark/i.test(fact))) {
      modelText = modelText.replace(
        "Hand lantern will need oil before climbing unless already filled.",
        "Lantern is already filled;",
      );
    }
    if (
      visibleInventory.includes("oil") &&
      !visibleFacts.some((fact) => /Hand lantern filled; beacon remains dark/i.test(fact))
    ) {
      modelText = modelText.replace(
        "Hand lantern will need oil before climbing unless already filled.",
        visibleInventory.includes("lantern")
          ? "Lantern still needs filling."
          : "Lantern is still missing; recover it before filling.",
      );
    }
    if (visibleInventory.includes("lantern") && !visibleActionIds.has("take_lantern")) {
      modelText = modelText.replace(
        "Take the lantern if it remains;",
        "Lantern is already carried;",
      );
    }
    if (visibleFacts.some((fact) => /boat signaled to hold/i.test(fact))) {
      modelText = modelText.replace(
        "Signal the boat first if needed;",
        "Boat signal already confirmed;",
      );
    }
    if (visibleFacts.some((fact) => /radio channel clear/i.test(fact))) {
      modelText = modelText
        .replace(
          "check radio if needed before taking the oil;",
          "Radio channel already confirmed;",
        )
        .replace(/check radio if needed;\s*/i, "");
    }
    if (visibleFacts.some((fact) => /Tower current restored/i.test(fact))) {
      modelText = modelText.replace(
        /If the fuse remains uninstalled, install it before leaving; the service ladder opens\.\s*/i,
        "",
      );
    }
    if (
      visibleFacts.some((fact) => /channel (?:is )?clear/i.test(fact)) &&
      !visibleFacts.some((fact) => /Emergency supply route: recover missing supplies/i.test(fact)) &&
      !visibleActionIds.has("close_storm_shutters")
    ) {
      modelText = modelText
        .replace("sheltered confirmed-channel rescue/", "confirmed-channel rescue/")
        .replace(
          "Bar shutters: sheltered finish",
          "Sheltered finish is unavailable after radio confirmation; use the confirmed-channel finish.",
        );
    }
    if (
      view.at?.[0] === "tower" &&
      !hasBeaconFinish &&
      !visibleFacts.some((fact) => /channel (?:is )?clear/i.test(fact))
    ) {
      modelText = modelText.replace(
        "Several lighting choices; most preparation: sheltered confirmed-channel rescue/secured-boat tuned rescue at tide/horn-timed rescue/marked-tide rescue/perfectly timed/fully prepared.",
        "No beacon finish is available yet; complete the available preparation before lighting.",
      );
    }
    if (
      view.at?.[0] === "tower" &&
      !visibleActionIds.has("close_storm_shutters") &&
      !visibleFacts.some((fact) => /Storm shutters barred/i.test(fact)) &&
      !visibleFacts.some((fact) => /Emergency supply route: recover missing supplies/i.test(fact))
    ) {
      modelText = modelText.replace(
        "Bar shutters: sheltered finish",
        "Sheltered finish unavailable yet.",
      );
    }
    if (visibleFacts.some((fact) => /Hand lantern filled; beacon remains dark/i.test(fact))) {
      modelText = modelText.replace(
        "If unsecured: read the log, take oil, then return to secure the mooring before studying tide.",
        "If unsecured: read the log, then return to secure the mooring before studying tide.",
      );
      modelText = modelText.replace(
        "Mooring is unsecured; take oil if needed, then return to secure it before studying the tide.",
        "Mooring is unsecured; return to secure it before studying the tide.",
      );
      modelText = modelText.replace(
        "tower relay can confirm the radio channel after the lantern is filled if needed.",
        "tower relay can confirm the radio channel if needed.",
      );
      if (!visibleFacts.some((fact) => /Tower current restored/i.test(fact))) {
        modelText = modelText.replace(
          "after the lantern is filled, only with time, use the repaired stair once current is restored and supplies are ready.",
          "Use the repaired stair after current is restored and supplies are ready.",
        );
      }
    }
    if (
      visibleFacts.some((fact) => /Wick trimmed for a clean beam/i.test(fact)) &&
      visibleFacts.some((fact) => /beacon lens is aligned with the channel/i.test(fact))
    ) {
      modelText = modelText.replace(
        "Aligned by hand if needed; charred wick can be trimmed before lighting the beacon if needed. ",
        "",
      );
    }
    if (
      visibleFacts.some((fact) => /Tower current restored/i.test(fact)) &&
      visibleActionIds.has("climb_repaired_stairs")
    ) {
      modelText = modelText.replace(
        "after the lantern is filled, only with time, use the repaired stair once current is restored and supplies are ready.",
        visibleFacts.some((fact) => /Hand lantern filled; beacon remains dark/i.test(fact))
          ? "Use the repaired stair now; the lantern is already filled."
          : "Use the repaired stair now; fill the lantern in the tower if needed.",
      );
    }
    if (isLastTurn && view.at?.[0] === "tower" && !hasBeaconFinish) {
      if (
        /(?:Beam tuning is complete|Horn timing is recorded); no rescue remains; leave if possible\./i.test(
          modelText,
        )
      ) {
        modelText = modelText.replace(
          /\s*Last turn: no rescue remains; leave if possible\./i,
          "",
        );
        modelText = modelText.replace(/^Beam tuning is complete\.\s*/i, "");
      }
      modelText = modelText.replace(
        /tower relay can confirm the radio channel(?: after the lantern is filled)? if needed\./i,
        "Radio checks are too late.",
      );
    }
    if (isLastTurn && view.at?.[0] === "tower" && hasBeaconFinish) {
      modelText = modelText.replace(/\s*Last turn: light now\./i, "");
    }
    modelText = modelText.replace(/; ([A-Z])/g, (_, letter) => `; ${letter.toLowerCase()}`);
  }
  const lastEvent = view.event?.startsWith("Mooring secure:")
    ? "Mooring secure: the boat will hold without signaling; this is already a stronger rescue. Basic rescue: skip signaling and light directly. Stronger channel route: enter the keeper's room, signal the secured boat, then check the radio."
    : view.event?.startsWith("Hand lantern filled;")
      ? "Lantern filled; either tuning choice is optional; both together earn the strongest rescue."
      : view.event;
  let modelLastEvent =
    visibleFacts.some((fact) => /Tower current restored/i.test(fact)) &&
    lastEvent ===
      "If current is not restored, install the switchboard fuse to restore tower power; otherwise return to the keeper's room for missing supplies."
      ? "Current is already restored; return to the keeper's room only for missing supplies or use the service ladder."
      : lastEvent;
  if (visibleFacts.some((fact) => /Storm shutters barred for a steady beam/i.test(fact))) {
    modelLastEvent = modelLastEvent?.replace(
      /\s*Bar storm shutters before this check if needed: close for a sheltered finish\./i,
      "",
    );
  }
  if (
    visibleFacts.some((fact) => /channel (?:is )?clear/i.test(fact)) &&
    !visibleFacts.some((fact) => /Emergency supply route: recover missing supplies/i.test(fact)) &&
    !visibleActionIds.has("close_storm_shutters")
  ) {
    modelLastEvent = modelLastEvent?.replace(
      /\s*Bar storm shutters before this check if needed: close for a sheltered finish\./i,
      "",
    );
  }
  if (
    visibleFacts.some((fact) => /Wick trimmed for a clean beam/i.test(fact)) &&
    visibleFacts.some((fact) => /beacon lens is aligned with the channel/i.test(fact))
  ) {
    modelLastEvent = modelLastEvent
      ?.replace(/Finish beam tuning if needed;\s*/i, "Beam tuning is complete; ")
      .replace(/Finish any trim or alignment before lighting if needed;\s*/i, "")
      .replace(/the remaining turn matters\.\s*/i, "")
      .replace(/after tuning\b/gi, "now");
  }
  if (isLastTurn && !hasBeaconFinish && modelLastEvent) {
    modelLastEvent = "No beacon finish remains; leave if possible.";
  } else if (isLastTurn && hasBeaconFinish && modelLastEvent) {
    modelLastEvent = "A beacon finish remains; light now; remaining preparation is too late.";
  }
  modelLastEvent = modelLastEvent?.replace(/; ([A-Z])/g, (_, letter) => `; ${letter.toLowerCase()}`);
  const dualSupplyRecovery =
    view.at?.[0] === "tower" &&
    !view.inv &&
    visibleActionIds.has("return_keeper_from_tower") &&
    visibleActionIds.has("return_keeper_for_lantern");
  const hornBonusRecorded = visibleFacts.some((fact) =>
    /You waited through one boat horn/i.test(fact),
  );
  return {
    goal: world.objective,
    t: view.turn,
    at: view.at,
    text: modelText,
    ...(isLastTurn
      ? {
          deadline: hasBeaconFinish
            ? "Last turn: light now; preparation will be too late."
            : "Last turn: no rescue remains; leave if possible.",
        }
      : {}),
    ...(view.inv ? { inv: view.inv } : {}),
    ...(view.facts ? { facts: view.facts } : {}),
    ...(modelLastEvent ? { last: modelLastEvent } : {}),
    a: (view.actions ?? []).map(([id, label], index) => [
      index,
      dualSupplyRecovery && id === "return_keeper_from_tower"
        ? "Descend to fetch oil first; the lantern is also missing"
        : dualSupplyRecovery && id === "return_keeper_for_lantern"
          ? "Descend to fetch the lantern first; oil is also missing"
          : isLastTurn &&
            !hornBonusRecorded &&
            id === "light_all_ready_beacon"
          ? "Light the tuned beacon now; no time remains for the horn bonus"
          : hornBonusRecorded && id === "light_all_ready_beacon"
            ? "Light the tuned beacon with the horn bonus"
            : label,
    ]),
  };
}

export function replayActions(world, seed, actionIds) {
  let state = createState(world, seed);
  let event = null;
  for (const actionId of actionIds) {
    const result = step(world, state, actionId);
    if (!result.ok) {
      throw new Error(`Trace is not replayable at turn ${state.turn}: ${result.error}`);
    }
    state = result.state;
    event = result.event;
  }
  return { state, observation: observation(world, state, event) };
}

export function createSeededRandom(seed) {
  let value = (Number(seed) | 0) || 1;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 0x100000000;
  };
}
