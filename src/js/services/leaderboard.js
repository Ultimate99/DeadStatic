const PROFILE_KEY = "dead-static-leaderboard-profile-v1";
const SCORE_VERSION = 1;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const store = {
  config: null,
  enabled: false,
  status: "idle",
  submitStatus: "idle",
  entries: [],
  profile: {
    playerId: "",
    codename: "",
  },
  lastUpdated: "",
  message: "",
  onChange: null,
};

function getWindow() {
  return typeof window === "undefined" ? null : window;
}

function notify() {
  if (typeof store.onChange === "function") {
    store.onChange();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isValidPlayerId(value) {
  return UUID_PATTERN.test(String(value || "").trim());
}

function fillRandomBytes(bytes) {
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(bytes);
    return bytes;
  }

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

function generateId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  const bytes = fillRandomBytes(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

function sanitizeCodename(value) {
  return String(value || "")
    .replace(/[^a-z0-9 _.-]/gi, "")
    .trim()
    .slice(0, 24);
}

function loadProfile() {
  const win = getWindow();
  const fallback = {
    playerId: generateId(),
    codename: "",
  };

  if (!win?.localStorage) {
    return fallback;
  }

  try {
    const raw = JSON.parse(win.localStorage.getItem(PROFILE_KEY) || "null");
    const profile = {
      playerId: isValidPlayerId(raw?.playerId) ? raw.playerId : fallback.playerId,
      codename: sanitizeCodename(raw?.codename || raw?.username || ""),
    };
    win.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (_error) {
    win.localStorage.setItem(PROFILE_KEY, JSON.stringify(fallback));
    return fallback;
  }
}

function saveProfile() {
  const win = getWindow();
  if (!win?.localStorage) {
    return;
  }

  try {
    win.localStorage.setItem(PROFILE_KEY, JSON.stringify(store.profile));
  } catch (_error) {
    // Ignore profile storage failures and keep the in-memory profile.
  }
}

function readConfig() {
  const win = getWindow();
  const source = win?.DEAD_STATIC_CONFIG?.leaderboard || {};
  const functionsBaseUrl = String(source.functionsBaseUrl || "").replace(/\/+$/, "");
  const publicToken = String(source.publicToken || "").trim();

  return {
    enabled: Boolean(source.enabled !== false && functionsBaseUrl),
    functionsBaseUrl,
    publicToken,
    listPath: String(source.listPath || "leaderboard-list").replace(/^\/+/, ""),
    submitPath: String(source.submitPath || "leaderboard-submit").replace(/^\/+/, ""),
    limit: clamp(Number(source.limit) || 10, 5, 25),
  };
}

function buildHeaders(config, withBody = false) {
  const headers = {};
  if (withBody) {
    headers["Content-Type"] = "application/json";
  }
  if (config.publicToken) {
    headers.apikey = config.publicToken;
    headers.Authorization = `Bearer ${config.publicToken}`;
  }
  return headers;
}

function buildUrl(config, path, query = "") {
  return `${config.functionsBaseUrl}/${path}${query}`;
}

function classifyProgress(summary) {
  if (summary.worldReveal) {
    return "Revealed";
  }
  if (summary.bunkerRouteKnown) {
    return "Bunker Line";
  }
  if (summary.secretProgress >= 4) {
    return "Deep Signal";
  }
  if (summary.radioProgress >= 3) {
    return "Signal Hunter";
  }
  if (summary.zonesVisited >= 4) {
    return "Outer Block";
  }
  if (summary.upgradesBuilt >= 6) {
    return "Outpost Keeper";
  }
  return "Cold Hands";
}

export function calculateLeaderboardScore(summary) {
  const nights = clamp(Number(summary.nightsSurvived) || 0, 0, 999);
  const upgrades = clamp(Number(summary.upgradesBuilt) || 0, 0, 999);
  const zones = clamp(Number(summary.zonesVisited) || 0, 0, 999);
  const radio = clamp(Number(summary.radioProgress) || 0, 0, 99);
  const secrets = clamp(Number(summary.secretProgress) || 0, 0, 99);
  const relics = clamp(Number(summary.relics) || 0, 0, 999);
  const survivors = clamp(Number(summary.survivors) || 0, 0, 999);
  const wins = clamp(Number(summary.combatsWon) || 0, 0, 999);
  const reputation = clamp(Number(summary.reputation) || 0, 0, 9999);
  const morale = clamp(Number(summary.morale) || 0, 0, 9999);
  const condition = clamp(Number(summary.condition) || 0, 0, 200);
  const day = clamp(Number(summary.day) || 1, 1, 999);

  return Math.max(
    0,
    Math.round(
      (nights * 140)
      + (upgrades * 35)
      + (zones * 65)
      + (radio * 90)
      + (secrets * 125)
      + (relics * 210)
      + (survivors * 55)
      + (wins * 45)
      + (reputation * 4)
      + (morale * 3)
      + (condition * 2)
      + ((day - 1) * 24)
      + (summary.bunkerRouteKnown ? 180 : 0)
      + (summary.worldReveal ? 520 : 0)
    ),
  );
}

function summarizeRun(state) {
  const summary = {
    day: state.time.day,
    hour: state.time.hour,
    condition: state.condition,
    nightsSurvived: state.stats.nightsSurvived,
    upgradesBuilt: state.upgrades.length,
    zonesVisited: state.visitedZones.length || state.stats.zonesVisited,
    radioProgress: state.story.radioProgress,
    secretProgress: state.story.secretProgress,
    relics: state.resources.relics,
    survivors: state.survivors.total,
    combatsWon: state.stats.combatsWon,
    reputation: state.resources.reputation,
    morale: state.resources.morale,
    bunkerRouteKnown: Boolean(state.flags.bunkerRouteKnown),
    worldReveal: Boolean(state.flags.worldReveal),
  };

  return {
    ...summary,
    stage: classifyProgress(summary),
    score: calculateLeaderboardScore(summary),
    scoreVersion: SCORE_VERSION,
  };
}

function normalizeEntries(entries = []) {
  return entries
    .map((entry, index) => {
      const stats = entry.stats || {};
      return {
        rank: Number(entry.rank) || index + 1,
        playerId: entry.player_id || entry.playerId || "",
        playerName: sanitizeCodename(entry.player_name || entry.playerName || "Unknown Signal") || "Unknown Signal",
        score: Number(entry.score) || 0,
        updatedAt: entry.updated_at || entry.updatedAt || "",
        stage: entry.stage || stats.stage || classifyProgress(stats),
        nights: Number(stats.nightsSurvived) || 0,
        zones: Number(stats.zonesVisited) || 0,
        radio: Number(stats.radioProgress) || 0,
      };
    })
    .sort((left, right) => right.score - left.score || left.rank - right.rank);
}

function markIdleMessage() {
  if (!store.enabled) {
    store.message = "Leaderboard is off for this build until a hosted backend is configured.";
  } else if (typeof globalThis.fetch !== "function") {
    store.message = "This browser runtime cannot reach the hosted board.";
  } else {
    store.message = "";
  }
}

export function initLeaderboard({ onChange } = {}) {
  store.onChange = onChange || null;
  store.config = readConfig();
  store.enabled = store.config.enabled;
  store.profile = loadProfile();
  store.entries = [];
  store.submitStatus = "idle";
  store.lastUpdated = "";
  store.status = store.enabled ? "idle" : "disabled";
  markIdleMessage();

  if (store.enabled && typeof globalThis.fetch === "function") {
    refreshLeaderboard({ silent: true });
  } else {
    notify();
  }

  return store;
}

export function getLeaderboardState() {
  return store;
}

export function getLeaderboardSnapshot(state) {
  const summary = summarizeRun(state);
  const playerName = sanitizeCodename(store.profile.codename || state?.player?.username || "");
  return {
    playerId: store.profile.playerId,
    playerName,
    summary,
  };
}

export function setLeaderboardUsername(value, { silent = false } = {}) {
  store.profile.codename = sanitizeCodename(value);
  saveProfile();
  if (!silent) {
    store.submitStatus = "idle";
    store.message = store.profile.codename
      ? `Username set to ${store.profile.codename}.`
      : "Username cleared.";
    notify();
  }
  return store.profile.codename;
}

export function promptForCallsign() {
  const win = getWindow();
  if (typeof win?.prompt !== "function") {
    return false;
  }

  const nextValue = win.prompt("Set your username for the Dead Static leaderboard.", store.profile.codename || "");
  if (nextValue === null) {
    return false;
  }

  setLeaderboardUsername(nextValue, { silent: true });
  store.submitStatus = "idle";
  store.message = store.profile.codename
    ? `Username set to ${store.profile.codename}.`
    : "Username cleared.";
  notify();
  return true;
}

export async function refreshLeaderboard({ silent = false } = {}) {
  if (!store.enabled || typeof globalThis.fetch !== "function") {
    store.status = store.enabled ? "error" : "disabled";
    markIdleMessage();
    notify();
    return false;
  }

  if (!silent) {
    store.status = "loading";
    store.message = "";
    notify();
  }

  try {
    const response = await fetch(
      buildUrl(store.config, store.config.listPath, `?limit=${store.config.limit}`),
      {
        method: "GET",
        headers: buildHeaders(store.config),
      },
    );
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Could not load leaderboard.");
    }

    store.entries = normalizeEntries(payload.entries).slice(0, store.config.limit);
    store.status = "ready";
    store.lastUpdated = payload.generatedAt || new Date().toISOString();
    store.message = "";
    notify();
    return true;
  } catch (error) {
    store.status = "error";
    store.message = error.message || "Could not load leaderboard.";
    notify();
    return false;
  }
}

export async function submitLeaderboardScore(state) {
  if (!store.enabled || typeof globalThis.fetch !== "function") {
    store.submitStatus = "error";
    markIdleMessage();
    notify();
    return false;
  }

  if ((!store.profile.codename || store.profile.codename.length < 3) && state?.player?.username) {
    setLeaderboardUsername(state.player.username, { silent: true });
  }

  if (!store.profile.codename || store.profile.codename.length < 3) {
    store.submitStatus = "error";
    store.message = "Set a username with at least 3 characters before submitting.";
    notify();
    return false;
  }

  const snapshot = getLeaderboardSnapshot(state);
  store.submitStatus = "submitting";
  store.message = "";
  notify();

  try {
    const response = await fetch(buildUrl(store.config, store.config.submitPath), {
      method: "POST",
      headers: buildHeaders(store.config, true),
      body: JSON.stringify(snapshot),
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error || "Could not submit leaderboard run.");
    }

    store.submitStatus = "success";
    store.message = payload.improved
      ? "Run uploaded. New personal best is live."
      : "Run checked in. Your best score still stands.";
    await refreshLeaderboard({ silent: true });
    notify();
    return true;
  } catch (error) {
    store.submitStatus = "error";
    store.message = error.message || "Could not submit leaderboard run.";
    notify();
    return false;
  }
}
