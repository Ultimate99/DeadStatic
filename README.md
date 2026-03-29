# Dead Static

## 1. Game Design Outline

`Dead Static` is a browser-based incremental survival game that starts with one desperate action and unfolds into a layered ASCII-heavy apocalypse sim. The player begins alone, scraping through rubble for enough material to survive the first night. Over time the interface grows along with the fiction: shelter management, food pressure, weapons, expeditions, survivor assignments, traders, faction politics, radio investigation, anomaly zones, and a hidden bunker route.

Core pillars:

- Tiny opening surface area that slowly expands through discovery.
- Survival pressure built from condition, hunger cadence, night danger, and limited supplies.
- Text-first atmosphere with an event log carrying tone, story, and feedback.
- Modular content data for upgrades, items, enemies, zones, radio signals, and special events.
- Late-game mystery built around impossible radio traffic and the nature of the static.

Content targets covered by the MVP data set:

- `26` upgrades
- `17` items and equipment pieces
- `8` explorable zones
- `30+` authored events
- `6` infected enemy types
- `3` factions
- `1` hidden bunker progression route

## 2. Core Gameplay Loop

Early game:

1. Search rubble for scrap and occasional supplies.
2. Burn scrap for warmth to stabilize condition.
3. Buy a few basic upgrades to survive the first nights.

Mid game:

1. Unlock food search, shelter storage, weapons, and scavenging runs.
2. Push into zones for better loot and riskier encounters.
3. Recruit survivors and assign them to roles that create passive gains.
4. Build out shelter systems, ammo, radio gear, and trader access.

Late game:

1. Tune radio signals to unlock lore, factions, and dangerous locations.
2. Manage combat, elite infected, relic acquisition, and automation.
3. Choose a faction or remain independent while chasing the secret bunker route.
4. Uncover the truth behind the impossible signal network known as `Dead Static`.

## 3. Progression Stages

### Stage 1: Cold Hands

- Visible UI is intentionally tiny: `Scrap`, `Condition`, `Search rubble`, optional `Burn 10 scrap for warmth`, and the event log.
- Early upgrade pressure revolves around `Backpack`, `Rusty Knife`, `Shelter Stash`, `Campfire`, `Basic Barricade`, and `First Aid Rag`.
- The first nights teach the player that passivity is dangerous.

### Stage 2: Thin Walls

- `Food search`, `Small scavenging runs`, and the first shelter upgrades appear.
- Inventory and equipment begin to matter.
- The player starts building enough stability to think beyond tonight.

### Stage 3: Outer Blocks

- Map and zone exploration open up.
- Combat starts with walkers and escalates into stalkers, screamers, and static-touched variants.
- Survivors, trader visits, crafting, ammo, and early radio systems appear.

### Stage 4: Voices In The Wire

- Radio chains unlock advanced zones, faction access, and relic hunting.
- Automation systems reduce manual scavenging pressure.
- Elite infected, raiders, and anomaly spaces complicate the risk curve.

### Stage 5: The Bunker Route

- A hidden route emerges through decoder progress, relics, and a recovered relay key.
- The player reaches the bunker entrance and starts learning what the static actually is.
- The world reveal reframes the outbreak as something shaped, amplified, or exploited by the signal lattice.

## 4. File And Folder Structure

Implemented layout:

```text
dead-static/
|- index.html
|- README.md
|- dist/
|  |- index.html
|  `- js/
|     `- game.js
|- scripts/
|  |- build/
|  |  |- build-all.mjs
|  |  |- build-bundle.mjs
|  |  `- build-standalone.mjs
|  `- serve/
|     `- serve-lan.mjs
- .github/
|  `- workflows/
|     |- deploy-pages.yml
|     `- deploy-supabase-functions.yml
- supabase/
|  |- config.toml
|  |- functions/
|  |  |- leaderboard-list/
|  |  |  `- index.ts
|  |  `- leaderboard-submit/
|  |     `- index.ts
|  `- migrations/
|     `- 20260329_dead_static_leaderboard.sql
|- src/
|  |- index.source.html
|  |- runtime-config.js
|  |- css/
|  |  |- styles.css
|  |  |- ui.css
|  |  `- ui/
|  |     |- core.css
|  |     |- shell.css
|  |     |- screens.css
|  |     `- atmosphere.css
|  `- js/
|     |- app.js
|     |- content.js
|     |- data.js
|     |- engine.js
|     |- events.js
|     |- render.js
|     |- state.js
|     `- render/
|        |- shared.js
|        |- shelter-map.js
|        |- stage.js
|        |- tabs-primary.js
|        `- tabs-secondary.js
`- tests/
   |- qa/
   |  `- qa.test.mjs
   `- qa.test.mjs
```

`src/`, `dist/`, and `scripts/build/` are now the canonical structure. The renderer is split into shared helpers, shelter-map logic, stage metadata, and tab groups; the stylesheet is split into ordered partials behind the `src/css/ui.css` import manifest. The older root `css/`, `js/`, and build-script paths remain only as compatibility shims so stale local links and commands do not break.

## 5. Suggested Data Structures

Resources:

```js
resources: {
  scrap: 0,
  food: 0,
  fuel: 0,
  parts: 0,
  medicine: 0,
  ammo: 0,
  morale: 0,
  reputation: 0,
  relics: 0
}
```

Items:

```js
{
  id: "rusty_knife",
  name: "Rusty Knife",
  type: "weapon",
  attack: 3,
  description: "Short reach, honest intent."
}
```

Upgrades:

```js
{
  id: "campfire",
  name: "Campfire",
  cost: { scrap: 18 },
  requires: { upgrades: ["shelter_stash"], burnUses: 1 },
  effects: { burnCondition: 6, defense: 1, discoverResources: ["fuel"] }
}
```

Enemies:

```js
{
  id: "static_touched",
  name: "Static-Touched",
  hp: 34,
  attack: [6, 10],
  reward: { relics: 1, parts: 3 },
  ascii: ["  .:::.  ", " ( o o ) ", " /  ^  \\\", "| '--' |"]
}
```

Events:

```js
{
  id: "numbers_station",
  pool: "radio",
  once: true,
  weight: 5,
  text: "A patient voice counts down a date that never arrived.",
  effects: { radioProgress: 1, unlockSections: ["radio"] }
}
```

Zones:

```js
{
  id: "flooded_tunnel",
  name: "Flooded Tunnel",
  risk: 3,
  hours: 4,
  enemies: ["stalker", "bloated_carrier"],
  loot: { parts: [4, 7], ammo: [1, 3], relics: [0, 1] }
}
```

## 6. MVP Implementation

The MVP includes:

- Minimal opening state and progressive UI reveal.
- Local save/load via `localStorage`.
- Data-driven upgrades, items, enemies, zones, factions, trader offers, and events.
- Shelter, inventory, equipment, survivor assignment, expeditions, combat, radio scans, and faction choice.
- A generated `dist/js/game.js` runtime plus standalone `dist/index.html` output so the game can be opened directly from disk without an external dev server.
- Late-game secret route hooks and a first-pass major reveal.

Build it with [`scripts/build/build-all.mjs`](C:\GPT_Games\Dead Static\scripts\build\build-all.mjs).

Run the generated build by opening [`dist/index.html`](C:\GPT_Games\Dead Static\dist\index.html) in a browser.

The root [`index.html`](C:\GPT_Games\Dead Static\index.html) is a thin launcher that redirects to the generated build.

### Open On Your Phone

1. Build the game:
   `node scripts\build\build-all.mjs`
2. Start the LAN server:
   `node scripts\serve\serve-lan.mjs`
3. Keep the terminal open and make sure your phone is on the same Wi-Fi network.
4. Open one of the printed `http://<your-pc-ip>:4173` addresses on your phone.

If Windows prompts for firewall access, allow `node` on private networks so the phone can reach the game.

## 8. GitHub Pages + Leaderboard Deployment

### GitHub Pages

1. Push this project to a GitHub repository.
2. In GitHub, open `Settings -> Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main` or run [deploy-pages.yml](C:\GPT_Games\Dead Static\.github\workflows\deploy-pages.yml).

The workflow builds the game, runs QA, and publishes `dist/`.

### Supabase Leaderboard

Files already added:

- SQL migration: [20260329_dead_static_leaderboard.sql](C:\GPT_Games\Dead Static\supabase\migrations\20260329_dead_static_leaderboard.sql)
- List function: [leaderboard-list/index.ts](C:\GPT_Games\Dead Static\supabase\functions\leaderboard-list\index.ts)
- Submit function: [leaderboard-submit/index.ts](C:\GPT_Games\Dead Static\supabase\functions\leaderboard-submit\index.ts)
- Function config: [config.toml](C:\GPT_Games\Dead Static\supabase\config.toml)
- Client config: [runtime-config.js](C:\GPT_Games\Dead Static\src\runtime-config.js)

Setup flow:

1. Create a Supabase project.
2. Run the SQL migration in the Supabase SQL editor or through the CLI.
3. Deploy both edge functions with JWT verification disabled.
4. If you want GitHub to deploy them automatically, add repository secrets:
   - `SUPABASE_PROJECT_ID`
   - `SUPABASE_ACCESS_TOKEN`
5. Edit [runtime-config.js](C:\GPT_Games\Dead Static\src\runtime-config.js):
   - `enabled: true`
   - `functionsBaseUrl: "https://<project-ref>.supabase.co/functions/v1"`
   - `publicToken: "<your publishable or anon key>"`
6. Commit and push again so GitHub Pages publishes the configured build.

### Notes

- Full saves still live in `localStorage`.
- The leaderboard stores only score summaries.
- This is an MVP leaderboard. It recomputes score on the server, but it is not a full anti-cheat system.

## 7. Expansion Ideas For Version 2

- More survivor jobs with fatigue, loyalty, and interpersonal events.
- Crafting recipes tied to found blueprints instead of direct upgrade purchases.
- Distinct zone sub-maps with multi-step expeditions and retreat paths.
- Weather, signal storms, and migrating infected pressure.
- Faction quest lines and mutually exclusive endings.
- Better bunker finale with multiple reveal branches and post-reveal systems.
- Audio-reactive radio puzzles and more layered ASCII set pieces.
