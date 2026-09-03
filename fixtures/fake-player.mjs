const PLAN_LABELS = [
  "Take the brass lantern",
  "Enter the keeper's house",
  "Take the oil flask",
  "Enter the workshop",
  "Take the ceramic fuse",
  "Install the fuse in the switchboard",
  "Return to the keeper's room",
  "Climb to the lantern room",
  "Fill the lantern with oil",
  "Light the storm beacon",
];

export function createPlayer() {
  let next = 0;
  return {
    descriptor: {
      name: "fake-direct-player",
      model: "fixture-v1",
      isolation: "test_fixture",
    },

    async choose({ turnInput }) {
      const expected = PLAN_LABELS[next];
      const row = turnInput.a.find(([, label]) => label === expected);
      if (!row) throw new Error(`Expected action label ${JSON.stringify(expected)} is not available.`);
      next += 1;
      return { index: row[0], usage: null };
    },

    async review() {
      return {
        ratings: { fun: 4, clarity: 5 },
        replayIntent: "yes",
        summary: "The route was clear and compact.",
        findings: [],
        usage: null,
      };
    },

    async close() {},
  };
}
