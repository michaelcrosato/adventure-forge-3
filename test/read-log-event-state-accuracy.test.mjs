import assert from "node:assert/strict";
import test from "node:test";
import { loadWorld, replayActions, step } from "../src/engine.mjs";

test("wall-log feedback omits the fuse step after repair", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 120001, [
    "enter_house",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;

  const logged = step(world, keeper, "read_log");
  assert.equal(logged.ok, true, logged.error);
  assert.match(logged.event, /fuse is already replaced.*fill the hand lantern/i);
  assert.doesNotMatch(logged.event, /replace the fuse, fill/i);
});

test("wall-log feedback omits the lantern step after filling", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 120002, [
    "enter_house",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
  ]).state;

  const logged = step(world, keeper, "read_log");
  assert.equal(logged.ok, true, logged.error);
  assert.match(logged.event, /lantern is already filled.*replace the fuse/i);
  assert.doesNotMatch(logged.event, /fill the hand lantern, then light/i);
});

test("wall-log feedback confirms both completed sequence steps", async () => {
  const world = await loadWorld();
  const keeper = replayActions(world, 120003, [
    "enter_house",
    "take_oil",
    "go_jetty",
    "take_lantern",
    "enter_house",
    "climb_tower",
    "fill_lantern",
    "return_keeper_after_fill",
    "go_workshop",
    "take_fuse",
    "install_fuse",
    "return_keeper_from_workshop",
  ]).state;

  const logged = step(world, keeper, "read_log");
  assert.equal(logged.ok, true, logged.error);
  assert.match(logged.event, /fuse is replaced and the lantern filled.*light the beacon/i);
  assert.doesNotMatch(logged.event, /replace the fuse, fill the hand lantern/i);
});
