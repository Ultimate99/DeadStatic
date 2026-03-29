import assert from "node:assert/strict";

import { getLeaderboardState, initLeaderboard } from "../../../src/js/services/leaderboard.js";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PROFILE_KEY = "dead-static-leaderboard-profile-v1";

export function registerLeaderboardTests(run) {
  run("leaderboard profile migrates legacy ids to uuid", () => {
    const originalWindow = globalThis.window;

    const storage = new Map([
      [PROFILE_KEY, JSON.stringify({
        playerId: "ds-mnc99ves-zx1vdchv",
        codename: "UltimateSRB",
      })],
    ]);

    globalThis.window = {
      DEAD_STATIC_CONFIG: {
        leaderboard: {
          enabled: false,
          functionsBaseUrl: "",
        },
      },
      localStorage: {
        getItem(key) {
          return storage.has(key) ? storage.get(key) : null;
        },
        setItem(key, value) {
          storage.set(key, String(value));
        },
        removeItem(key) {
          storage.delete(key);
        },
      },
    };

    try {
      initLeaderboard();
      const state = getLeaderboardState();
      const savedProfile = JSON.parse(storage.get(PROFILE_KEY));

      assert.match(state.profile.playerId, UUID_PATTERN);
      assert.equal(savedProfile.playerId, state.profile.playerId);
      assert.equal(state.profile.codename, "UltimateSRB");
    } finally {
      if (typeof originalWindow === "undefined") {
        delete globalThis.window;
      } else {
        globalThis.window = originalWindow;
      }
    }
  });
}
