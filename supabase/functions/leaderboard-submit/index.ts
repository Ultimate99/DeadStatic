import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Summary = {
  day: number;
  hour: number;
  condition: number;
  nightsSurvived: number;
  upgradesBuilt: number;
  zonesVisited: number;
  radioProgress: number;
  secretProgress: number;
  relics: number;
  survivors: number;
  combatsWon: number;
  reputation: number;
  morale: number;
  bunkerRouteKnown: boolean;
  worldReveal: boolean;
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders,
      ...(init.headers || {}),
    },
  });
}

function clamp(value: unknown, min: number, max: number) {
  const numeric = Number(value) || 0;
  return Math.max(min, Math.min(max, numeric));
}

function normalizeName(value: unknown) {
  return String(value || "")
    .replace(/[^a-z0-9 _.-]/gi, "")
    .trim()
    .slice(0, 24);
}

function classifyProgress(summary: Summary) {
  if (summary.worldReveal) return "Revealed";
  if (summary.bunkerRouteKnown) return "Bunker Line";
  if (summary.secretProgress >= 4) return "Deep Signal";
  if (summary.radioProgress >= 3) return "Signal Hunter";
  if (summary.zonesVisited >= 4) return "Outer Block";
  if (summary.upgradesBuilt >= 6) return "Outpost Keeper";
  return "Cold Hands";
}

function calculateScore(summary: Summary) {
  return Math.max(
    0,
    Math.round(
      (summary.nightsSurvived * 140)
      + (summary.upgradesBuilt * 35)
      + (summary.zonesVisited * 65)
      + (summary.radioProgress * 90)
      + (summary.secretProgress * 125)
      + (summary.relics * 210)
      + (summary.survivors * 55)
      + (summary.combatsWon * 45)
      + (summary.reputation * 4)
      + (summary.morale * 3)
      + (summary.condition * 2)
      + ((summary.day - 1) * 24)
      + (summary.bunkerRouteKnown ? 180 : 0)
      + (summary.worldReveal ? 520 : 0)
    ),
  );
}

function sanitizeSummary(raw: Record<string, unknown>): Summary {
  return {
    day: clamp(raw.day, 1, 999),
    hour: clamp(raw.hour, 0, 23),
    condition: clamp(raw.condition, 0, 200),
    nightsSurvived: clamp(raw.nightsSurvived, 0, 999),
    upgradesBuilt: clamp(raw.upgradesBuilt, 0, 999),
    zonesVisited: clamp(raw.zonesVisited, 0, 999),
    radioProgress: clamp(raw.radioProgress, 0, 99),
    secretProgress: clamp(raw.secretProgress, 0, 99),
    relics: clamp(raw.relics, 0, 999),
    survivors: clamp(raw.survivors, 0, 999),
    combatsWon: clamp(raw.combatsWon, 0, 999),
    reputation: clamp(raw.reputation, 0, 9999),
    morale: clamp(raw.morale, 0, 9999),
    bunkerRouteKnown: Boolean(raw.bunkerRouteKnown),
    worldReveal: Boolean(raw.worldReveal),
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Missing Supabase environment." }, { status: 500 });
  }

  const payload = await request.json().catch(() => null);
  const playerId = String(payload?.playerId || "").trim();
  const playerName = normalizeName(payload?.playerName);
  const summary = sanitizeSummary((payload?.summary || {}) as Record<string, unknown>);
  const score = calculateScore(summary);
  const stage = classifyProgress(summary);

  if (!UUID_PATTERN.test(playerId)) {
    return json({ error: "Invalid player id." }, { status: 400 });
  }

  if (playerName.length < 3) {
    return json({ error: "Player name must be at least 3 characters." }, { status: 400 });
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: existing, error: readError } = await client
    .from("leaderboard_scores")
    .select("score")
    .eq("player_id", playerId)
    .maybeSingle();

  if (readError) {
    return json({ error: readError.message }, { status: 500 });
  }

  const bestScore = Math.max(existing?.score || 0, score);
  const improved = bestScore > (existing?.score || 0);

  const { error: writeError } = await client
    .from("leaderboard_scores")
    .upsert({
      player_id: playerId,
      player_name: playerName,
      score: bestScore,
      score_version: 1,
      stage,
      stats: {
        ...summary,
        stage,
      },
    }, {
      onConflict: "player_id",
    });

  if (writeError) {
    return json({ error: writeError.message }, { status: 500 });
  }

  return json({
    accepted: true,
    improved,
    entry: {
      playerId,
      playerName,
      score: bestScore,
      stage,
      stats: {
        ...summary,
        stage,
      },
    },
  });
});
