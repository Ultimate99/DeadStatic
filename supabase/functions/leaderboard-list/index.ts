import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return json({ error: "Method not allowed." }, { status: 405 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Missing Supabase environment." }, { status: 500 });
  }

  const client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const url = new URL(request.url);
  const limit = Math.max(5, Math.min(25, Number(url.searchParams.get("limit")) || 10));
  const { data, error } = await client
    .from("leaderboard_scores")
    .select("player_id, player_name, score, stage, stats, updated_at")
    .order("score", { ascending: false })
    .order("updated_at", { ascending: true })
    .limit(limit);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({
    generatedAt: new Date().toISOString(),
    entries: (data || []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
    })),
  });
});
