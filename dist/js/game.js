/* Dead Static bundled runtime for direct file-open compatibility. */

// data.js
const SAVE_KEY = "dead-static-save-v2";

const RESOURCE_ORDER = [
  "scrap",
  "wood",
  "food",
  "water",
  "cloth",
  "fuel",
  "parts",
  "wire",
  "medicine",
  "ammo",
  "electronics",
  "chemicals",
  "morale",
  "reputation",
  "relics",
];

const RESOURCE_DEFS = {
  scrap: { label: "Scrap", tier: "core" },
  wood: { label: "Wood", tier: "core" },
  food: { label: "Food", tier: "core" },
  water: { label: "Drinkable Water", tier: "core" },
  cloth: { label: "Cloth", tier: "common" },
  fuel: { label: "Fuel", tier: "uncommon" },
  parts: { label: "Parts", tier: "uncommon" },
  wire: { label: "Wire", tier: "uncommon" },
  medicine: { label: "Medicine", tier: "rare" },
  ammo: { label: "Ammo", tier: "rare" },
  electronics: { label: "Electronics", tier: "rare" },
  chemicals: { label: "Chemicals", tier: "rare" },
  morale: { label: "Morale", tier: "social" },
  reputation: { label: "Reputation", tier: "social" },
  relics: { label: "Relics", tier: "mythic" },
};

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "anomalous", "mythic"];

const RARITY_DEFS = {
  common: {
    label: "Common",
    hint: "easy salvage",
  },
  uncommon: {
    label: "Uncommon",
    hint: "worth checking twice",
  },
  rare: {
    label: "Rare",
    hint: "good days and locked cabinets",
  },
  epic: {
    label: "Epic",
    hint: "deep salvage and worthwhile risk",
  },
  legendary: {
    label: "Signal-Bound",
    hint: "sealed stock and city-grade hardware",
  },
  anomalous: {
    label: "Anomalous",
    hint: "found where the static gets physical",
  },
  mythic: {
    label: "Pre-Fall Prototype",
    hint: "the city still hiding impossible machines",
  },
};

const SURVIVOR_ROLES = {
  scavenger: {
    label: "Scavenger",
    description: "Pulls slow salvage from the nearby bones of the city.",
  },
  guard: {
    label: "Guard",
    description: "Turns a weak shelter into a defended one.",
  },
  medic: {
    label: "Medic",
    description: "Stretches medicine and keeps condition losses manageable.",
  },
  scout: {
    label: "Scout",
    description: "Improves expedition yields and escape odds.",
  },
  tuner: {
    label: "Tuner",
    description: "Listens deeper into the static and finds better routes.",
  },
};

const SURVIVOR_NAME_POOL = [
  "Mara Vale",
  "Jonah Wren",
  "Petra Voss",
  "Ilan Cross",
  "Tessa Bloom",
  "Rook Mercer",
  "Nadia Pike",
  "Vale Mercer",
  "Iris Flint",
  "Milan Dusk",
  "Orin Pike",
  "Cora Ash",
  "Toma Redd",
  "Lena Wex",
  "Riva Thorn",
  "Niko Slate",
  "Jessa Vale",
  "Bram Kest",
  "Ana Drift",
  "Miro Sable",
  "Rhea Crow",
  "Luka Morn",
  "Dara Venn",
  "Tarin Fox",
];

const SURVIVOR_TRAITS = {
  quiet_hands: {
    label: "Quiet Hands",
    role: "scavenger",
    summary: "Pulls cleaner salvage and keeps nearby lanes quieter.",
  },
  pack_rat: {
    label: "Pack Rat",
    role: "scavenger",
    summary: "Turns salvage-heavy runs into better scrap and parts returns.",
  },
  hard_case: {
    label: "Hard Case",
    role: "guard",
    summary: "Blunts night damage and holds the line when the fence shakes.",
  },
  lantern_nerve: {
    label: "Lantern Nerve",
    role: "guard",
    summary: "Keeps morale from dropping when nights get loud.",
  },
  patch_saint: {
    label: "Patch Saint",
    role: "medic",
    summary: "Makes medical work stretch further than it should.",
  },
  bone_saw: {
    label: "Bone Saw",
    role: "medic",
    summary: "Trades comfort for efficient recovery and ugly field care.",
  },
  pathfinder: {
    label: "Pathfinder",
    role: "scout",
    summary: "Reads routes better, cuts encounter odds, and spots exits faster.",
  },
  breaker: {
    label: "Breaker",
    role: "scout",
    summary: "Best on hard pushes, fast breaches, and violent sweeps.",
  },
  ghost_ear: {
    label: "Ghost Ear",
    role: "tuner",
    summary: "Builds directed radio traces faster than static should allow.",
  },
  odd_frequency: {
    label: "Odd Frequency",
    role: "tuner",
    summary: "Finds anomaly traces quickly but leaves everyone slightly on edge.",
  },
};

const ITEMS = {
  sharp_metal: {
    id: "sharp_metal",
    name: "Sharp Metal",
    type: "material",
    description: "A sign edge snapped into something almost intentional.",
  },
  rusty_knife: {
    id: "rusty_knife",
    name: "Rusty Knife",
    type: "weapon",
    attack: 3,
    description: "Ugly steel, honest reach.",
  },
  pry_bar: {
    id: "pry_bar",
    name: "Pry Bar",
    type: "tool",
    description: "Forced entry, broken lockers, and every crate that wants to stay shut.",
  },
  salvage_hatchet: {
    id: "salvage_hatchet",
    name: "Salvage Hatchet",
    type: "tool",
    description: "Splits timber, bites into weak boards, and keeps the fence honest.",
  },
  carpenter_kit: {
    id: "carpenter_kit",
    name: "Carpenter Kit",
    type: "tool",
    description: "Squares, clamps, spikes, and the discipline to keep the shelter from rotting loose.",
  },
  hand_drill: {
    id: "hand_drill",
    name: "Hand Drill",
    type: "tool",
    description: "Slow, clean leverage for repair work, power rigs, and careful salvage.",
  },
  signal_meter: {
    id: "signal_meter",
    name: "Signal Meter",
    type: "tool",
    description: "A tuned meter that separates real signal from ambient static and bad hope.",
  },
  nail_bat: {
    id: "nail_bat",
    name: "Nail Bat",
    type: "weapon",
    attack: 5,
    description: "No subtlety. Good weight.",
  },
  hunting_spear: {
    id: "hunting_spear",
    name: "Hunting Spear",
    type: "weapon",
    attack: 6,
    description: "Long reach, clean thrusts, and less need to let the dead get close.",
  },
  transit_pistol: {
    id: "transit_pistol",
    name: "Transit Pistol",
    type: "weapon",
    attack: 4,
    ammoPerAttack: 1,
    description: "Reliable if fed and held with intent.",
  },
  tower_rifle: {
    id: "tower_rifle",
    name: "Tower Rifle",
    type: "weapon",
    attack: 6,
    ammoPerAttack: 1,
    description: "Recovered from height and bad judgment.",
  },
  fire_axe: {
    id: "fire_axe",
    name: "Fire Axe",
    type: "weapon",
    attack: 7,
    description: "The city made these for emergencies. The city was right.",
  },
  patchwork_vest: {
    id: "patchwork_vest",
    name: "Patchwork Vest",
    type: "armor",
    defense: 2,
    description: "Layered fabric, cut plates, and stubborn stitching.",
  },
  riot_padding: {
    id: "riot_padding",
    name: "Riot Padding",
    type: "armor",
    defense: 3,
    description: "Old municipal armor, still trying.",
  },
  signal_cloak: {
    id: "signal_cloak",
    name: "Signal Cloak",
    type: "armor",
    defense: 2,
    description: "Copper-threaded cloth that makes the air feel wrong.",
  },
  first_aid_rag: {
    id: "first_aid_rag",
    name: "First Aid Rag",
    type: "consumable",
    heal: 14,
    description: "Barely sterile. Still better than nothing.",
  },
  bandage_roll: {
    id: "bandage_roll",
    name: "Bandage Roll",
    type: "consumable",
    heal: 22,
    description: "Enough clean wrap to buy another afternoon.",
  },
  canned_beans: {
    id: "canned_beans",
    name: "Canned Beans",
    type: "consumable",
    condition: 6,
    resources: { food: 1 },
    description: "Still sealed. Still sacred.",
  },
  fuel_cell: {
    id: "fuel_cell",
    name: "Fuel Cell",
    type: "consumable",
    resources: { fuel: 2 },
    description: "Portable heat and worse ideas.",
  },
  road_flare: {
    id: "road_flare",
    name: "Road Flare",
    type: "consumable",
    condition: 4,
    resources: { morale: 1 },
    description: "A hard red burn that makes the dark feel answerable.",
  },
  field_filter: {
    id: "field_filter",
    name: "Field Filter",
    type: "consumable",
    condition: 4,
    resources: { water: 2 },
    description: "A cracked purifier that still wins arguments with bad water.",
  },
  clinic_case: {
    id: "clinic_case",
    name: "Clinic Case",
    type: "consumable",
    heal: 18,
    resources: { medicine: 1 },
    description: "A hard-shell medical kit that still shuts clean.",
  },
  coil_spike: {
    id: "coil_spike",
    name: "Coil Spike",
    type: "weapon",
    attack: 5,
    description: "A relay pin turned into a brutal hand tool.",
  },
  tower_battery: {
    id: "tower_battery",
    name: "Tower Battery",
    type: "consumable",
    resources: { electronics: 2, fuel: 1 },
    description: "A dense emergency cell that still remembers the grid.",
  },
  odd_relic: {
    id: "odd_relic",
    name: "Odd Relic",
    type: "key",
    description: "Warms in static pockets and heavy weather.",
  },
  relay_key: {
    id: "relay_key",
    name: "Relay Key",
    type: "key",
    description: "Stamped with a tower insignia and a serial that should be archived.",
  },
  bunker_pass: {
    id: "bunker_pass",
    name: "Bunker Pass",
    type: "key",
    description: "Access card from somewhere that should be empty.",
  },
  static_lens: {
    id: "static_lens",
    name: "Static Lens",
    type: "key",
    description: "A warped optic that makes the noise feel structural.",
  },
};

const ITEM_ORDER = Object.keys(ITEMS);


// content.js
const UPGRADES = [
  {
    id: "backpack",
    name: "Backpack",
    description: "Stitch scavenged cloth and straps into something worth carrying.",
    verb: "Rig",
    cost: { scrap: 8, cloth: 3 },
    requires: { searches: 3 },
    effects: { searchScrapMin: 1, searchScrapMax: 1, searchBonusRolls: 1 },
  },
  {
    id: "rusty_knife",
    name: "Rusty Knife",
    description: "Wrap a sharp shard, bind the handle, and call it honest work.",
    verb: "Bind",
    cost: { scrap: 6, parts: 3, cloth: 1 },
    materials: { sharp_metal: 1 },
    requires: { searches: 4 },
    effects: {
      attack: 1,
      grantItems: { rusty_knife: 1 },
      unlockSections: ["inventory"],
    },
  },
  {
    id: "shelter_stash",
    name: "Shelter Stash",
    description: "A corner that counts as ownership.",
    verb: "Secure",
    cost: { scrap: 14, wood: 4, cloth: 2 },
    requires: { searches: 4 },
    effects: {
      unlockSections: ["shelter"],
      discoverResources: ["food"],
      defense: 1,
    },
  },
  {
    id: "campfire",
    name: "Campfire",
    description: "A controlled glow beats a cold death.",
    verb: "Assemble",
    cost: { scrap: 18, wood: 3, fuel: 2, cloth: 1 },
    requires: { upgrades: ["shelter_stash"], burnUses: 1 },
    effects: {
      burnCondition: 5,
      defense: 1,
      discoverResources: ["fuel"],
      unlockSections: ["shelter"],
    },
  },
  {
    id: "basic_barricade",
    name: "Basic Barricade",
    description: "It will not stop everything. It does not need to.",
    verb: "Brace",
    cost: { scrap: 24, wood: 5, parts: 4, wire: 2 },
    requires: { upgrades: ["shelter_stash"] },
    effects: { defense: 2, nightMitigation: 0.35, unlockSections: ["shelter"] },
  },
  {
    id: "first_aid_rag",
    name: "First Aid Rag",
    description: "A filthy medical miracle.",
    cost: { cloth: 2, medicine: 1 },
    requires: { searches: 5 },
    effects: {
      grantItems: { first_aid_rag: 1 },
      discoverResources: ["medicine"],
    },
  },
  {
    id: "food_search",
    name: "Simple Food Search",
    description: "Separate hunger from useful scrap before both kill you.",
    cost: { scrap: 14, wood: 2, water: 1 },
    requires: { upgrades: ["shelter_stash"] },
    effects: {
      searchFoodChance: 0.08,
      searchBonusRolls: 1,
    },
  },
  {
    id: "small_scavenge",
    name: "Small Scavenging Runs",
    description: "A cautious loop beyond line of sight.",
    cost: { scrap: 28, food: 2, water: 2 },
    requires: { upgrades: ["backpack", "rusty_knife"] },
    effects: {
      unlockSections: ["map"],
      unlockZones: ["ruined_street"],
      expeditionLootBonus: 0.03,
    },
  },
  {
    id: "food_crate",
    name: "Food Storage",
    description: "Enough order to keep hunger from winning by accounting.",
    cost: { scrap: 30, wood: 4, parts: 5, cloth: 2 },
    requires: { upgrades: ["food_search"] },
    effects: {
      forageYieldBonus: 0.14,
      discoverResources: ["food"],
    },
  },
  {
    id: "crafting_bench",
    name: "Crafting Bench",
    description: "The first place built for making instead of hiding.",
    cost: { scrap: 34, wood: 4, parts: 8, wire: 2 },
    requires: { upgrades: ["small_scavenge"] },
    effects: {
      searchPartChance: 0.06,
      rareLootBonus: 0.06,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "pry_bar_tool",
    name: "Pry Bar",
    description: "Leverage wins fights with crates, doors, and sealed salvage before they start.",
    verb: "Forge",
    cost: { scrap: 14, wood: 1, parts: 4, cloth: 1 },
    materials: { sharp_metal: 1 },
    requires: { upgrades: ["crafting_bench"] },
    effects: {
      grantItems: { pry_bar: 1 },
      searchPartChance: 0.08,
      salvageYieldBonus: 0.06,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "salvage_hatchet",
    name: "Salvage Hatchet",
    description: "A compact splitter for timber, weak boards, and ugly shelter work.",
    verb: "Forge",
    cost: { scrap: 16, wood: 3, parts: 3, cloth: 1 },
    materials: { sharp_metal: 1 },
    requires: { upgrades: ["crafting_bench"] },
    effects: {
      grantItems: { salvage_hatchet: 1 },
      forageYieldBonus: 0.08,
      nightMitigation: 0.15,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "carpenter_kit",
    name: "Carpenter Kit",
    description: "A real repair roll: square, clamps, spikes, and enough discipline to keep the base from shaking apart.",
    verb: "Assemble",
    cost: { scrap: 20, wood: 4, parts: 6, cloth: 1 },
    requires: { upgrades: ["crafting_bench", "salvage_hatchet"] },
    effects: {
      grantItems: { carpenter_kit: 1 },
      repairPower: 1,
      maintenance: 1,
      nightMitigation: 0.18,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "hand_drill",
    name: "Hand Drill",
    description: "Slow leverage for clean fix work, better joints, and signal rigs that stop dying from lazy braces.",
    verb: "Build",
    cost: { scrap: 22, wood: 2, parts: 7, wire: 2 },
    requires: { upgrades: ["crafting_bench", "pry_bar_tool"] },
    effects: {
      grantItems: { hand_drill: 1 },
      searchPartChance: 0.06,
      repairPower: 1,
      signalGain: 0.05,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "weapon_rack",
    name: "Weapon Slot",
    description: "A proper place for a proper answer.",
    cost: { scrap: 34, wood: 2, parts: 6, wire: 1 },
    requires: { upgrades: ["crafting_bench"] },
    effects: {
      weaponSlot: true,
      unlockSections: ["inventory"],
      attack: 1,
    },
  },
  {
    id: "nail_bat",
    name: "Nail Bat",
    description: "The first reliable answer to anything that reaches the doorway.",
    verb: "Hammer",
    cost: { scrap: 18, wood: 5, parts: 3, wire: 1, cloth: 1 },
    requires: { upgrades: ["weapon_rack", "crafting_bench"] },
    effects: {
      grantItems: { nail_bat: 1 },
      attack: 1,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "hunting_spear",
    name: "Hunting Spear",
    description: "Long reach, cleaner kills, and less need to let the dead lean on you.",
    verb: "Shaft",
    cost: { scrap: 24, wood: 7, parts: 4, cloth: 2 },
    requires: { upgrades: ["weapon_rack", "watch_post"] },
    effects: {
      grantItems: { hunting_spear: 1 },
      attack: 2,
      expeditionLootBonus: 0.04,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "armor_hooks",
    name: "Armor Slot",
    description: "A wall of hooks for whatever passes as protection now.",
    cost: { scrap: 34, wood: 2, parts: 6, cloth: 2 },
    requires: { upgrades: ["crafting_bench"] },
    effects: {
      armorSlot: true,
      unlockSections: ["inventory"],
      defense: 1,
    },
  },
  {
    id: "riot_padding_kit",
    name: "Riot Padding",
    description: "Municipal armor re-cut for a world where everything closes distance too fast.",
    verb: "Refit",
    cost: { scrap: 24, cloth: 5, parts: 6, wire: 1 },
    requires: { upgrades: ["armor_hooks", "watch_post"] },
    effects: {
      grantItems: { riot_padding: 1 },
      defense: 1,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "watch_post",
    name: "Watch Post",
    description: "Higher eyes make the nights shorter.",
    cost: { scrap: 46, wood: 7, parts: 8, wire: 2 },
    requires: { upgrades: ["basic_barricade"] },
    effects: {
      defense: 3,
      survivorCap: 1,
      expeditionEncounterAdjust: -0.04,
      nightMitigation: 0.45,
    },
  },
  {
    id: "tripwire_grid",
    name: "Tripwire Grid",
    description: "Wire the approach, mark the choke, and make every breach pay for the step.",
    cost: { scrap: 38, wood: 5, parts: 6, wire: 5 },
    requires: { upgrades: ["basic_barricade", "watch_post"] },
    effects: {
      defense: 2,
      siegeMitigation: 0.55,
      coverage: 0.2,
      nightMitigation: 0.25,
    },
  },
  {
    id: "ammo_press",
    name: "Ammo Press",
    description: "No bullets appear on purpose by accident.",
    cost: { scrap: 40, wood: 2, parts: 10, chemicals: 3 },
    requires: { upgrades: ["crafting_bench"] },
    effects: {
      discoverResources: ["ammo"],
      rareLootBonus: 0.04,
    },
  },
  {
    id: "repair_rig",
    name: "Repair Rig",
    description: "A fixed frame for real patch work, clean joints, and fast line repairs when the fence starts to fail.",
    cost: { scrap: 42, wood: 5, parts: 10, wire: 2 },
    requires: { upgrades: ["crafting_bench", "survivor_cots"] },
    effects: {
      repairPower: 2,
      maintenance: 1,
      nightMitigation: 0.12,
    },
  },
  {
    id: "rain_collector",
    name: "Rain Collector",
    description: "A cleaner mouthful than the old pipes.",
    cost: { scrap: 28, wood: 4, parts: 5, cloth: 2, wire: 2 },
    requires: { upgrades: ["shelter_stash"] },
    effects: {
      conditionRegen: 0.01,
      passive: { water: 0.015 },
      forageYieldBonus: 0.08,
    },
  },
  {
    id: "water_still",
    name: "Water Still",
    description: "Turns dubious runoff into something the shelter can keep inside people.",
    cost: { scrap: 28, wood: 5, parts: 6, fuel: 2, cloth: 2 },
    requires: { upgrades: ["rain_collector", "smokehouse"] },
    effects: {
      passive: { water: 0.01 },
      waterSecurity: 1,
      conditionRegen: 0.01,
    },
  },
  {
    id: "radio_rig",
    name: "Radio",
    description: "The dead city still has a voice.",
    cost: { scrap: 32, parts: 10, wire: 5, electronics: 3, fuel: 2 },
    requires: { upgrades: ["watch_post"] },
    effects: {
      unlockSections: ["radio"],
      radioDepth: 0.35,
      discoverResources: ["reputation"],
    },
  },
  {
    id: "battery_bank",
    name: "Battery Bank",
    description: "Stack reserve cells and stop letting every quiet hour kill your signal tools.",
    cost: { scrap: 36, parts: 9, wire: 4, electronics: 3, fuel: 2 },
    requires: { upgrades: ["radio_rig"] },
    effects: {
      power: 3,
      signalGain: 0.08,
      maintenance: 1,
    },
  },
  {
    id: "signal_meter",
    name: "Signal Meter",
    description: "A tuned meter that catches the difference between carrier, interference, and something worse.",
    verb: "Tune",
    cost: { scrap: 24, parts: 6, wire: 4, electronics: 2 },
    requires: { upgrades: ["radio_rig", "crafting_bench"] },
    effects: {
      grantItems: { signal_meter: 1 },
      signalGain: 0.12,
      anomalyGain: 0.08,
      unlockSections: ["inventory"],
    },
  },
  {
    id: "flood_lights",
    name: "Flood Lights",
    description: "Hard white arcs over the fence line. Ugly. Effective. Impossible to ignore.",
    cost: { scrap: 34, parts: 8, wire: 5, electronics: 2, fuel: 3 },
    requires: { upgrades: ["watch_post", "radio_rig"] },
    effects: {
      defense: 1,
      coverage: 0.7,
      nightMitigation: 0.3,
    },
  },
  {
    id: "map_board",
    name: "Map",
    description: "A wall of routes, guesses, and exits that failed.",
    cost: { scrap: 32, wood: 3, parts: 5, cloth: 2 },
    requires: { upgrades: ["small_scavenge"] },
    effects: {
      unlockSections: ["map"],
      unlockZones: ["burned_apartments", "abandoned_gas_station"],
    },
  },
  {
    id: "survivor_cots",
    name: "Survivor Recruitment",
    description: "A second mattress is a public statement.",
    cost: { scrap: 36, wood: 6, food: 4, water: 3, cloth: 4 },
    requires: { upgrades: ["food_crate"] },
    effects: {
      unlockSections: ["survivors"],
      discoverResources: ["morale"],
      survivorCap: 2,
    },
  },
  {
    id: "smokehouse",
    name: "Smokehouse",
    description: "A shelter that smells like tomorrow.",
    cost: { scrap: 48, wood: 8, parts: 8, fuel: 4, cloth: 2 },
    requires: { upgrades: ["food_crate"] },
    effects: {
      forageYieldBonus: 0.22,
      conditionRegen: 0.01,
    },
  },
  {
    id: "trader_beacon",
    name: "Signal Beacon",
    description: "A disciplined tower mark that sharpens the shelter line instead of advertising a market.",
    cost: { scrap: 40, wood: 3, parts: 8, wire: 3, fuel: 4 },
    requires: { upgrades: ["radio_rig"] },
    effects: {
      signalGain: 0.18,
      nightMitigation: 0.35,
    },
  },
  {
    id: "scout_bike",
    name: "Scout Bike",
    description: "Fast enough to be reckless on purpose.",
    cost: { scrap: 52, parts: 14, fuel: 8, electronics: 2 },
    requires: { upgrades: ["map_board"] },
    effects: {
      unlockZones: ["flooded_tunnel", "hospital_wing"],
      expeditionLootBonus: 0.08,
      scoutBonus: 0.04,
    },
  },
  {
    id: "signal_decoder",
    name: "Signal Decoder",
    description: "Translates the hiss into intent.",
    cost: { scrap: 52, parts: 14, wire: 4, electronics: 4, relics: 2 },
    requires: { upgrades: ["radio_rig"], radioProgress: 2 },
    effects: {
      radioDepth: 0.75,
      signalGain: 0.12,
      secretProgress: 1,
    },
  },
  {
    id: "auto_scavenger",
    name: "Auto Scavenger",
    description: "A dumb rig that can still find bright metal.",
    cost: { scrap: 68, wood: 4, parts: 18, wire: 4, fuel: 6 },
    requires: { upgrades: ["survivor_cots", "watch_post"] },
    effects: {
      passive: {
        scrap: 0.02,
        parts: 0.008,
      },
      salvageYieldBonus: 0.08,
      scoutBonus: 0.04,
    },
  },
  {
    id: "faraday_mesh",
    name: "Faraday Mesh",
    description: "Wire the walls before the walls start listening back.",
    cost: { scrap: 64, parts: 18, wire: 8, electronics: 2, relics: 2 },
    requires: { upgrades: ["signal_decoder"] },
    effects: {
      defense: 4,
      nightMitigation: 0.85,
    },
  },
  {
    id: "relay_tap",
    name: "Relay Tap",
    description: "Steal power from a signal that never asked permission.",
    cost: { scrap: 66, parts: 20, wire: 7, electronics: 4, fuel: 8 },
    requires: { upgrades: ["trader_beacon"], radioProgress: 4 },
    effects: {
      radioDepth: 0.55,
      signalGain: 0.22,
      anomalyGain: 0.2,
    },
  },
  {
    id: "bunker_drill",
    name: "Bunker Drill",
    description: "Something under the city was not meant to open easily.",
    cost: { scrap: 78, parts: 22, wire: 6, fuel: 12, relics: 3 },
    requires: { upgrades: ["signal_decoder"], secretProgress: 2 },
    effects: {
      unlockZones: ["hidden_bunker_entrance"],
      secretProgress: 1,
    },
  },
];

const UPGRADES_BY_ID = Object.fromEntries(UPGRADES.map((upgrade) => [upgrade.id, upgrade]));

const ENEMIES = {
  walker: {
    id: "walker",
    name: "Walker",
    hp: 14,
    attack: [3, 5],
    reward: { scrap: 1 },
    description: "Slow, wet footsteps and no intention of stopping.",
    behavior: {
      defaultIntent: "grapple",
      intents: ["grapple", "lunge", "lunge"],
      gripChance: 0.35,
      gripPenalty: 0.18,
      aftermathThreat: 0.22,
      summary: "Likes to pin and drag the fight into a blunt mess.",
    },
    ascii: [
      "   .-.   ",
      "  (o o)  ",
      "  | O |  ",
      "  |   |  ",
      "  '~~~'  ",
    ],
  },
  screecher: {
    id: "screecher",
    name: "Screecher",
    hp: 18,
    attack: [4, 7],
    reward: { scrap: 1, ammo: 1 },
    description: "All throat, no restraint.",
    behavior: {
      defaultIntent: "shriek",
      intents: ["shriek", "lunge", "shriek"],
      shriekThreat: 0.45,
      shriekNoise: 0.6,
      retreatPenalty: 0.12,
      summary: "Builds pressure if you leave it alive or let it run.",
    },
    ascii: [
      "  .---.  ",
      " / x x \\ ",
      "|   ^   |",
      "|  ---  |",
      " \\\\___// ",
    ],
  },
  bloated_carrier: {
    id: "bloated_carrier",
    name: "Bloated Carrier",
    hp: 24,
    attack: [5, 8],
    reward: { fuel: 1, medicine: 1 },
    description: "Swollen with rot and useful things.",
    behavior: {
      defaultIntent: "rupture",
      intents: ["rupture", "lunge", "rupture"],
      deathBurst: { chemicals: 1, medicine: 1 },
      deathSplash: 3,
      summary: "Can burst open on death and splash anyone too close.",
    },
    ascii: [
      "  .---.  ",
      " ( ___ ) ",
      "| (___) |",
      "|  :::  |",
      " '-----' ",
    ],
  },
  stalker: {
    id: "stalker",
    name: "Stalker",
    hp: 22,
    attack: [6, 9],
    reward: { parts: 2 },
    description: "Quiet enough to feel unfair.",
    behavior: {
      defaultIntent: "ambush",
      intents: ["ambush", "lunge", "feint"],
      openerBonus: [2, 4],
      retreatPenalty: 0.2,
      summary: "Opens hard and punishes retreat if you lose the angle.",
    },
    ascii: [
      "  /\\_/\\\\ ",
      " ( o.o )",
      "  > ^ < ",
      " //   \\\\",
      "//     \\\\",
    ],
  },
  static_touched: {
    id: "static_touched",
    name: "Static-Touched",
    hp: 32,
    attack: [7, 11],
    reward: { relics: 1, parts: 2 },
    description: "Moves to a rhythm the city should have lost years ago.",
    behavior: {
      defaultIntent: "pulse",
      intents: ["pulse", "lunge", "pulse"],
      signalBurn: 0.35,
      moraleHit: 1,
      summary: "Builds static pressure and drains radio certainty mid-fight.",
    },
    ascii: [
      "  .:::.  ",
      " ( o o ) ",
      " /  ^  \\\\",
      "| '--' | ",
      " \\\\_=_// ",
    ],
  },
  relay_brute: {
    id: "relay_brute",
    name: "Relay Brute",
    hp: 40,
    attack: [9, 13],
    reward: { relics: 2, reputation: 1 },
    description: "Tower muscle wrapped in old transmitter mesh.",
    behavior: {
      defaultIntent: "crush",
      intents: ["crush", "lunge", "crush"],
      armor: 1,
      breachDamage: 1,
      summary: "Soaks weak hits and hits hard enough to damage shelter confidence.",
    },
    ascii: [
      " [#####] ",
      " (x x x) ",
      " /|===|\\\\",
      "/_|___|_\\\\",
      "  /   \\\\ ",
    ],
  },
};

const ZONES = [
  {
    id: "ruined_street",
    name: "Ruined Street",
    description: "Crushed storefronts, dead traffic, loose copper in the walls.",
    risk: 1,
    hours: 2,
    encounterChance: 0.2,
    enemies: ["walker", "screecher"],
    loot: { scrap: [5, 9], wood: [2, 4], cloth: [1, 2], water: [0, 1], food: [0, 2], parts: [1, 2], fuel: [0, 1] },
    itemPool: ["pry_bar", "canned_beans"],
    itemChance: 0.16,
  },
  {
    id: "burned_apartments",
    name: "Burned Apartments",
    description: "Stacked smoke damage and private tragedies.",
    risk: 2,
    hours: 3,
    encounterChance: 0.28,
    enemies: ["walker", "stalker"],
    loot: { scrap: [7, 12], wood: [2, 5], cloth: [1, 3], water: [1, 2], food: [1, 3], parts: [2, 4], medicine: [0, 1] },
    itemPool: ["patchwork_vest", "bandage_roll"],
    itemChance: 0.2,
  },
  {
    id: "abandoned_gas_station",
    name: "Abandoned Gas Station",
    description: "The pumps are dry, but the tanks forgot that.",
    risk: 2,
    hours: 3,
    encounterChance: 0.3,
    enemies: ["walker", "bloated_carrier"],
    loot: { scrap: [4, 8], water: [0, 1], fuel: [2, 5], parts: [1, 3], chemicals: [0, 1] },
    itemPool: ["fuel_cell", "transit_pistol"],
    itemChance: 0.2,
  },
  {
    id: "flooded_tunnel",
    name: "Flooded Tunnel",
    description: "Black water, old wiring, movement where there should be none.",
    risk: 3,
    hours: 4,
    encounterChance: 0.38,
    enemies: ["stalker", "bloated_carrier"],
    loot: { scrap: [6, 10], parts: [4, 7], wire: [1, 3], ammo: [1, 3], relics: [0, 1] },
    itemPool: ["nail_bat", "relay_key"],
    itemChance: 0.22,
  },
  {
    id: "hospital_wing",
    name: "Hospital Wing",
    description: "Curtains stiff with dust, corridors still giving orders.",
    risk: 4,
    hours: 4,
    encounterChance: 0.42,
    enemies: ["screecher", "static_touched"],
    loot: { water: [1, 2], medicine: [2, 5], chemicals: [1, 2], parts: [2, 4], relics: [0, 1] },
    itemPool: ["riot_padding", "bandage_roll"],
    itemChance: 0.24,
  },
  {
    id: "radio_tower_perimeter",
    name: "Radio Tower Perimeter",
    description: "The fence hums even without power. Especially without power.",
    risk: 5,
    hours: 5,
    encounterChance: 0.5,
    enemies: ["static_touched", "relay_brute"],
    loot: { parts: [5, 9], wire: [2, 4], electronics: [1, 2], fuel: [2, 5], reputation: [2, 4], relics: [1, 2] },
    itemPool: ["tower_rifle", "static_lens"],
    itemChance: 0.26,
  },
  {
    id: "glass_orchard",
    name: "Glass Orchard",
    description: "An anomaly grove where frozen figures bloom from the road.",
    risk: 5,
    hours: 5,
    encounterChance: 0.48,
    enemies: ["stalker", "static_touched"],
    loot: { water: [1, 2], parts: [4, 6], electronics: [0, 1], morale: [1, 2], relics: [1, 3] },
    itemPool: ["signal_cloak", "odd_relic"],
    itemChance: 0.28,
  },
  {
    id: "hidden_bunker_entrance",
    name: "Hidden Bunker Entrance",
    description: "A concrete mouth under the city, still pretending not to exist.",
    risk: 6,
    hours: 5,
    encounterChance: 0.56,
    enemies: ["static_touched", "relay_brute"],
    loot: { scrap: [8, 12], parts: [6, 10], wire: [2, 4], electronics: [1, 2], reputation: [3, 5], relics: [2, 4] },
    itemPool: ["bunker_pass", "fire_axe"],
    itemChance: 0.32,
  },
];

const ZONES_BY_ID = Object.fromEntries(ZONES.map((zone) => [zone.id, zone]));

const FACTIONS = [
  {
    id: "signal_hunters",
    name: "Signal Hunters",
    description: "Patient scavengers of towers, frequencies, and truths.",
    bonuses: ["Directed radio sweeps build traces faster", "Hunter exchange opens signal-heavy deals", "Signal objectives pull deeper tech"],
    costs: ["Hotter signal work raises noise and raid attention"],
    effects: { radioDepth: 0.5, signalGain: 0.42, expeditionLootBonus: 0.05, traderDiscount: 0.04 },
    consequences: {
      tradeChannel: "hunter_exchange",
      objectiveBias: { signal: 0.16 },
      nightNoise: 0.25,
      raidBias: 0.04,
    },
  },
  {
    id: "iron_lantern",
    name: "Iron Lantern",
    description: "Militant keepers of lit ground and strict borders.",
    bonuses: ["Night defense and breach control improve immediately", "Lantern depot opens arms and medical stock", "Guards hit harder during pressure events"],
    costs: ["Anomaly tracing slows under their doctrine"],
    effects: { defense: 2, attack: 1, nightMitigation: 1.2 },
    consequences: {
      tradeChannel: "lantern_depot",
      raidMitigation: 0.14,
      breachMitigation: 0.1,
      anomalyPenalty: 0.2,
    },
  },
  {
    id: "ash_marauders",
    name: "Ash Marauders",
    description: "Mobile opportunists with a market ethic and bad manners.",
    bonuses: ["Hard pushes and sweep objectives return more salvage", "Broker channel favors ammo, caches, and ugly gear", "Close-quarters fighting gets meaner"],
    costs: ["Your shelter gets louder and raider attention climbs"],
    effects: { expeditionLootBonus: 0.15, attack: 1, salvageYieldBonus: 0.12, traderDiscount: 0.06 },
    consequences: {
      tradeChannel: "marauder_broker",
      objectiveBias: { salvage: 0.14, sweep: 0.12 },
      nightNoise: 0.35,
      raidBias: 0.08,
    },
  },
];

const FACTIONS_BY_ID = Object.fromEntries(FACTIONS.map((faction) => [faction.id, faction]));

const TRADER_CHANNELS = [
  {
    id: "open_market",
    name: "Open Market",
    description: "General traffic. Food, meds, loose wire, and whatever walks in without asking permission.",
    tag: "neutral",
  },
  {
    id: "hunter_exchange",
    name: "Hunter Exchange",
    description: "Signal Hunters trade in field tech, tower whispers, and relic-sensitive gear.",
    tag: "signal",
    requiresFaction: "signal_hunters",
  },
  {
    id: "lantern_depot",
    name: "Lantern Depot",
    description: "Iron Lantern stock runs military and defensive, priced like they know it.",
    tag: "defense",
    requiresFaction: "iron_lantern",
  },
  {
    id: "marauder_broker",
    name: "Marauder Broker",
    description: "Ash Marauders sell fast salvage, contraband rounds, and reckless routes.",
    tag: "salvage",
    requiresFaction: "ash_marauders",
  },
];

const TRADER_CHANNELS_BY_ID = Object.fromEntries(TRADER_CHANNELS.map((channel) => [channel.id, channel]));

const TRADER_OFFERS = [
  {
    id: "crate_meal",
    name: "Crate Meal",
    channels: ["open_market", "lantern_depot"],
    cost: { scrap: 14 },
    reward: { resources: { food: 3, water: 2, morale: 1 } },
    description: "Cans, jugs, and one good lie.",
  },
  {
    id: "field_meds",
    name: "Field Meds",
    channels: ["open_market", "lantern_depot"],
    cost: { scrap: 12, cloth: 1 },
    reward: { resources: { medicine: 2, chemicals: 1 }, grantItems: { bandage_roll: 1 } },
    description: "Bandages, pills, and no questions.",
  },
  {
    id: "wire_spool",
    name: "Wire Spool",
    channels: ["open_market", "hunter_exchange"],
    cost: { scrap: 10, parts: 1 },
    reward: { resources: { wire: 4, electronics: 1 } },
    description: "Insulated spool and one board still worth opening.",
  },
  {
    id: "tower_whisper",
    name: "Tower Whisper",
    channels: ["hunter_exchange"],
    cost: { fuel: 2, wire: 1, parts: 2 },
    reward: { resources: { reputation: 2 }, radioProgress: 1, radioTrace: { tower_grid: 1 } },
    description: "Directions spoken like a confession.",
  },
  {
    id: "loose_rounds",
    name: "Loose Rounds",
    channels: ["open_market", "marauder_broker"],
    cost: { scrap: 10, chemicals: 1, parts: 1 },
    reward: { resources: { ammo: 5 } },
    description: "Sorted by caliber, mostly.",
  },
  {
    id: "armor_bundle",
    name: "Armor Bundle",
    channels: ["lantern_depot"],
    cost: { scrap: 20, cloth: 2, parts: 4 },
    reward: { grantItems: { patchwork_vest: 1 } },
    description: "Cloth, leather, plates, and a lot of thread.",
  },
  {
    id: "rifle_cache",
    name: "Rifle Cache",
    channels: ["lantern_depot", "marauder_broker"],
    cost: { scrap: 24, ammo: 2, reputation: 2 },
    reward: { grantItems: { tower_rifle: 1 } },
    description: "Something long, cleaned, and hidden on purpose.",
  },
  {
    id: "relic_trade",
    name: "Relic Trade",
    channels: ["hunter_exchange"],
    cost: { relics: 1, scrap: 8 },
    reward: { resources: { fuel: 3, parts: 4, reputation: 1 } },
    description: "The lantern folk collect stranger things than you do.",
  },
  {
    id: "static_cloth",
    name: "Static Cloth",
    channels: ["hunter_exchange"],
    cost: { relics: 2, reputation: 2 },
    reward: { grantItems: { signal_cloak: 1 } },
    description: "Conductive fabric for people with bad priorities.",
  },
  {
    id: "breach_kit",
    name: "Breach Kit",
    channels: ["marauder_broker"],
    cost: { scrap: 18, parts: 3, fuel: 1 },
    reward: { resources: { ammo: 3, parts: 2 }, grantItems: { road_flare: 1 } },
    description: "Fast-entry tools and enough fire to leave fast too.",
  },
];

const SCAVENGE_SOURCES = [
  {
    id: "rubble",
    label: "Search rubble",
    short: "RU",
    description: "Broken masonry, splintered frames, wet cloth, open pockets.",
    detail: "Balanced salvage with real shelter material in it. Cheap, quick, and no longer quiet if you lean on it too hard.",
    focus: ["Scrap", "Wood", "Drinkable Water"],
    tags: ["1h", "rising noise", "street debris"],
    hours: 1,
    threat: 0.42,
    noise: 0.52,
    scrapMod: { min: 0, max: 0 },
    directResources: {
      wood: [1, 1],
    },
    guaranteed: ["common"],
    rolls: [
      { rarity: "uncommon", chance: 0.74 },
      { rarity: "rare", chance: 0.16, rareBonus: 1 },
      { rarity: "epic", chance: 0.06, rareBonus: 0.45, requires: { searches: 10 } },
      { rarity: "legendary", chance: 0.025, rareBonus: 0.2, requires: { searches: 18 } },
      { rarity: "anomalous", chance: 0.018, rareBonus: 0.16, requires: { radioProgress: 4 } },
      { rarity: "mythic", chance: 0.012, rareBonus: 0.08, requires: { flags: ["worldReveal"] } },
    ],
    bonusChance: 0.58,
    rarityBias: { uncommon: 0.02, rare: 0.03 },
    logLabel: "the rubble",
    eventChance: 0.42,
  },
  {
    id: "vehicle_shells",
    label: "Strip vehicle shells",
    short: "VH",
    description: "Dash metal, fuel lines, batteries, and glovebox lies.",
    detail: "Better for parts, wire, and fuel. Slightly louder than rubble and worth it.",
    focus: ["Parts", "Fuel", "Wire"],
    tags: ["1h", "medium noise", "engine blocks"],
    hours: 1,
    threat: 0.48,
    noise: 0.72,
    scrapMod: { min: 0, max: 1 },
    directResources: {
      parts: [1, 2],
      fuel: [0, 1],
    },
    guaranteed: ["common", "uncommon"],
    rolls: [
      { rarity: "rare", chance: 0.24, rareBonus: 1.1 },
      { rarity: "epic", chance: 0.1, rareBonus: 0.5, requires: { upgrades: ["crafting_bench"] } },
      { rarity: "legendary", chance: 0.045, rareBonus: 0.24, requires: { upgrades: ["watch_post"] } },
      { rarity: "anomalous", chance: 0.014, rareBonus: 0.1, requires: { radioProgress: 4 } },
    ],
    bonusChance: 0.66,
    rarityBias: { rare: 0.04, epic: 0.03 },
    requires: { searches: 4 },
    logLabel: "the vehicle shells",
    eventChance: 0.46,
  },
  {
    id: "dead_pantries",
    label: "Check dead pantries",
    short: "PN",
    description: "Cupboards, kitchen sinks, old shelves, and sealed luck.",
    detail: "Reliable food and water lane. Low yield in scrap, high value when hunger starts talking.",
    focus: ["Food", "Drinkable Water", "Medicine"],
    tags: ["1h", "quiet", "food lane"],
    hours: 1,
    threat: 0.28,
    noise: 0.26,
    scrapMod: { min: -1, max: 0 },
    directResources: {
      food: [1, 2],
      water: [1, 1],
    },
    guaranteed: ["common", "uncommon"],
    rolls: [
      { rarity: "rare", chance: 0.18, rareBonus: 0.9 },
      { rarity: "epic", chance: 0.08, rareBonus: 0.36, requires: { upgrades: ["food_crate"] } },
      { rarity: "legendary", chance: 0.022, rareBonus: 0.14, requires: { upgrades: ["smokehouse"] } },
    ],
    bonusChance: 0.54,
    rarityBias: { uncommon: 0.05, rare: 0.02 },
    requires: { upgrades: ["food_search"] },
    logLabel: "the dead pantries",
    eventChance: 0.36,
  },
  {
    id: "clinic_drawers",
    label: "Sweep clinic drawers",
    short: "CL",
    description: "Cracked cabinets, labelled trays, and pills no one came back for.",
    detail: "Medicine lane. Slower to open up, but it starts paying in clean painkillers and better tools.",
    focus: ["Medicine", "Chemicals", "Cloth"],
    tags: ["1h", "medium noise", "medical lane"],
    hours: 1,
    threat: 0.38,
    noise: 0.58,
    scrapMod: { min: -1, max: 0 },
    directResources: {
      medicine: [1, 1],
      cloth: [0, 1],
    },
    guaranteed: ["common", "uncommon"],
    rolls: [
      { rarity: "rare", chance: 0.3, rareBonus: 1.15 },
      { rarity: "epic", chance: 0.12, rareBonus: 0.5, requires: { upgrades: ["crafting_bench"] } },
      { rarity: "legendary", chance: 0.035, rareBonus: 0.18, requires: { upgrades: ["smokehouse"] } },
    ],
    bonusChance: 0.6,
    rarityBias: { rare: 0.05, epic: 0.03 },
    requires: { upgrades: ["first_aid_rag"] },
    logLabel: "the clinic drawers",
    eventChance: 0.44,
  },
  {
    id: "signal_wrecks",
    label: "Trace signal wrecks",
    short: "SG",
    description: "Tower scrap, relay boxes, antenna guts, and static-burned hardware.",
    detail: "Electronics lane. Stronger upper rarity access once the radio is online.",
    focus: ["Wire", "Electronics", "Relics"],
    tags: ["2h", "high noise", "signal lane"],
    hours: 2,
    threat: 0.62,
    noise: 1.18,
    scrapMod: { min: -1, max: 0 },
    directResources: {
      wire: [1, 2],
      electronics: [1, 1],
    },
    guaranteed: ["uncommon"],
    rolls: [
      { rarity: "rare", chance: 0.34, rareBonus: 1.2 },
      { rarity: "epic", chance: 0.18, rareBonus: 0.62, requires: { radioProgress: 1 } },
      { rarity: "legendary", chance: 0.085, rareBonus: 0.34, requires: { radioProgress: 2 } },
      { rarity: "anomalous", chance: 0.05, rareBonus: 0.24, requires: { radioProgress: 4 } },
      { rarity: "mythic", chance: 0.018, rareBonus: 0.12, requires: { flags: ["worldReveal"] } },
    ],
    bonusChance: 0.72,
    rarityBias: { epic: 0.05, legendary: 0.04, anomalous: 0.03 },
    requires: { upgrades: ["radio_rig"] },
    logLabel: "the signal wrecks",
    eventChance: 0.54,
  },
  {
    id: "sealed_caches",
    label: "Crack sealed caches",
    short: "SC",
    description: "Locked service cases, ammo tins, and someone else's emergency plan.",
    detail: "Late mid-game cache lane. Costs more threat and needs a pry bar, but pays with gear and upper-tier hardware.",
    focus: ["Ammo", "Parts", "Gear"],
    tags: ["2h", "high noise", "sealed stock"],
    hours: 2,
    threat: 0.72,
    noise: 1.34,
    scrapMod: { min: 0, max: 1 },
    directResources: {
      parts: [1, 2],
      ammo: [1, 2],
    },
    guaranteed: ["uncommon"],
    rolls: [
      { rarity: "rare", chance: 0.36, rareBonus: 1.2 },
      { rarity: "epic", chance: 0.2, rareBonus: 0.65, requires: { upgrades: ["crafting_bench"] } },
      { rarity: "legendary", chance: 0.12, rareBonus: 0.42, requires: { upgrades: ["watch_post"] } },
      { rarity: "anomalous", chance: 0.038, rareBonus: 0.2, requires: { secretProgress: 1 } },
      { rarity: "mythic", chance: 0.02, rareBonus: 0.12, requires: { flags: ["worldReveal"] } },
    ],
    bonusChance: 0.7,
    rarityBias: { rare: 0.03, epic: 0.06, legendary: 0.05 },
    requires: { upgrades: ["watch_post", "crafting_bench"], items: ["pry_bar"] },
    logLabel: "the sealed caches",
    eventChance: 0.58,
  },
];

const SCAVENGE_SOURCES_BY_ID = Object.fromEntries(SCAVENGE_SOURCES.map((source) => [source.id, source]));

const EXPEDITION_APPROACHES = [
  {
    id: "cautious",
    label: "Cautious",
    short: "quiet route",
    description: "Move slow, skip bad angles, and bring enough to wait things out.",
    cost: { food: 1, water: 1 },
    hours: 1,
    encounterDelta: -0.18,
    lootBonus: -0.1,
    threat: 0.08,
    noise: 0.12,
    travelEventChance: 0.28,
  },
  {
    id: "standard",
    label: "Standard",
    short: "balanced route",
    description: "The middle path. Not elegant. Usually survivable.",
    cost: {},
    hours: 0,
    encounterDelta: 0,
    lootBonus: 0,
    threat: 0.34,
    noise: 0.48,
    travelEventChance: 0.38,
  },
  {
    id: "forced",
    label: "Forced",
    short: "fast and loud",
    description: "Push hard, break locks, and accept that everything hears you.",
    cost: { water: 1, fuel: 1, ammo: 1 },
    hours: -1,
    encounterDelta: 0.16,
    lootBonus: 0.12,
    threat: 0.78,
    noise: 1.18,
    travelEventChance: 0.58,
  },
];

const EXPEDITION_APPROACHES_BY_ID = Object.fromEntries(EXPEDITION_APPROACHES.map((approach) => [approach.id, approach]));

const EXPEDITION_OBJECTIVES = [
  {
    id: "salvage",
    label: "Salvage",
    short: "metal + parts",
    description: "Strip weight, pry hardware, and come back heavier than you left.",
    resourceBias: { scrap: 0.3, parts: 0.18, wire: 0.1, fuel: 0.08 },
    itemChanceBonus: 0.02,
    encounterDelta: 0.06,
    hours: 0,
    threat: 0.14,
    noise: 0.18,
    tags: ["yield", "parts", "louder"],
  },
  {
    id: "provisions",
    label: "Provisions",
    short: "food + water",
    description: "Aim for cupboards, clean water, and anything that keeps the room fed.",
    resourceBias: { food: 0.36, water: 0.26, cloth: 0.1, medicine: 0.06 },
    itemChanceBonus: 0.02,
    encounterDelta: -0.08,
    hours: 0,
    threat: -0.08,
    noise: -0.12,
    tags: ["safer", "food", "water"],
  },
  {
    id: "medicine",
    label: "Medicine",
    short: "meds + chems",
    description: "Push into cabinets, triage rooms, and cold storage looking for clean help.",
    resourceBias: { medicine: 0.46, chemicals: 0.28, water: 0.08, cloth: 0.08 },
    itemChanceBonus: 0.05,
    encounterDelta: 0.05,
    hours: 1,
    threat: 0.1,
    noise: 0.06,
    tags: ["slow", "medical", "clean"],
  },
  {
    id: "signal",
    label: "Signal",
    short: "tech + clues",
    description: "Chase relay boxes, tower residue, and strange hardware with a pulse still in it.",
    resourceBias: { wire: 0.16, electronics: 0.28, reputation: 0.16, relics: 0.1, parts: 0.1 },
    itemChanceBonus: 0.08,
    encounterDelta: 0.08,
    hours: 1,
    threat: 0.18,
    noise: 0.2,
    traceGain: { tower_grid: 1.2, anomaly_trace: 0.7 },
    tags: ["tech", "clues", "hot"],
  },
  {
    id: "sweep",
    label: "Sweep",
    short: "fight + caches",
    description: "Push hard, clear movement, and accept that the route may turn into a brawl.",
    resourceBias: { ammo: 0.24, parts: 0.18, scrap: 0.12, relics: 0.08 },
    itemChanceBonus: 0.1,
    encounterDelta: 0.16,
    hours: -1,
    threat: 0.26,
    noise: 0.3,
    combatBonus: 1,
    tags: ["combat", "fast", "cache"],
  },
];

const EXPEDITION_OBJECTIVES_BY_ID = Object.fromEntries(EXPEDITION_OBJECTIVES.map((objective) => [objective.id, objective]));

const EXPEDITION_ROUTE_EVENTS = [
  {
    id: "quiet_cutthrough",
    label: "Quiet cut-through",
    text: "You find a narrow service cut-through and shave a full block off the route without waking anything worth naming.",
    approaches: ["cautious"],
    weight: 3,
    encounterDelta: -0.12,
    timeDelta: -1,
    threatDelta: -0.08,
  },
  {
    id: "locker_rattle",
    label: "Rattled lockers",
    text: "A bank of service lockers gives way. The noise buys you more salvage and more attention at the same time.",
    objectives: ["salvage", "sweep"],
    weight: 3,
    resources: { scrap: 3, parts: 2 },
    encounterDelta: 0.08,
    noiseDelta: 0.18,
  },
  {
    id: "cold_pantry",
    label: "Cold pantry",
    text: "A sealed pantry room still holds clean tins and bottled water if you move fast and carry it all.",
    objectives: ["provisions"],
    weight: 3,
    resources: { food: 2, water: 2 },
    lootBonus: 0.06,
  },
  {
    id: "surgical_cart",
    label: "Surgical cart",
    text: "An overturned treatment cart gives up bandages and bitter pills after you drag it free.",
    objectives: ["medicine"],
    zones: ["hospital_wing", "burned_apartments"],
    weight: 3,
    resources: { medicine: 1, chemicals: 1 },
    condition: 2,
  },
  {
    id: "signal_ping",
    label: "Signal ping",
    text: "A live relay ping answers your sweep. It does not last long, but it gives the board another clean angle.",
    objectives: ["signal"],
    weight: 4,
    radioTrace: { tower_grid: 0.8, anomaly_trace: 0.35 },
    resources: { reputation: 1 },
  },
  {
    id: "maintenance_marker",
    label: "Maintenance marker",
    text: "Old route paint points deeper into the city underworks. The mark matters more than the scrap around it.",
    objectives: ["signal", "medicine"],
    weight: 2,
    radioTrace: { sublevel_echo: 0.8 },
    secretProgress: 1,
  },
  {
    id: "flood_detour",
    label: "Flood detour",
    text: "The route collapses into flood water and bad footing. You make it through slower and meaner than planned.",
    zones: ["flooded_tunnel", "hospital_wing"],
    weight: 2,
    timeDelta: 1,
    encounterDelta: 0.08,
    condition: -4,
  },
  {
    id: "watcher_nest",
    label: "Watcher nest",
    text: "A half-cleared nest forces a fast violent push. You get the route, but the route gets a piece of you too.",
    objectives: ["sweep"],
    approaches: ["forced", "standard"],
    weight: 3,
    lootBonus: 0.08,
    encounterDelta: 0.1,
    stress: 1,
  },
  {
    id: "sealed_case",
    label: "Sealed case",
    text: "A reinforced transit case opens under leverage and patience, paying out better gear than the lane promised.",
    items: ["pry_bar", "hand_drill"],
    weight: 2,
    resources: { parts: 2, ammo: 1 },
    lootBonus: 0.1,
  },
  {
    id: "dead_drop",
    label: "Dead drop",
    text: "Someone marked a supply dead drop and never came back for it. Their loss is route discipline for another day.",
    day: 4,
    weight: 2,
    resources: { food: 1, water: 1, ammo: 1, parts: 1 },
    morale: 1,
  },
];

const EXPEDITION_ROUTE_EVENTS_BY_ID = Object.fromEntries(EXPEDITION_ROUTE_EVENTS.map((event) => [event.id, event]));

const RADIO_INVESTIGATIONS = [
  {
    id: "civic_band",
    label: "Civic Band",
    short: "archive traffic",
    description: "Sweep old emergency channels, public dispatch, and evacuation spillover.",
    traceLabel: "Archive trace",
    milestones: [
      {
        id: "civic_dispatch",
        at: 1,
        text: "Archive traffic resolves into a calm evacuation countdown and a hospital wing repeating under it.",
        effects: { radioProgress: 1, resources: { reputation: 1 }, unlockZones: ["hospital_wing"] },
      },
      {
        id: "civic_market",
        at: 3,
        text: "Price codes and lantern marks bleed into the civic band, but the real value is the route chatter hiding under them.",
        effects: { radioProgress: 1, resources: { reputation: 1, parts: 1 } },
      },
      {
        id: "civic_rumor",
        at: 5,
        text: "The old city band knows route names the living are still using. Someone kept listening after everyone else stopped.",
        effects: { radioProgress: 1, resources: { reputation: 2 } },
      },
    ],
  },
  {
    id: "tower_grid",
    label: "Tower Grid",
    short: "tower relays",
    description: "Triangulate tower relay bursts and the channels built to carry them.",
    traceLabel: "Tower trace",
    milestones: [
      {
        id: "tower_perimeter",
        at: 1,
        text: "A clipped tower handoff maps the perimeter and proves the fence still talks when it should be dead.",
        effects: { radioProgress: 1, unlockZones: ["radio_tower_perimeter"] },
      },
      {
        id: "tower_cells",
        at: 3,
        text: "The tower grid starts naming its own maintenance cells. There are more hands on the signal than you thought.",
        effects: { radioProgress: 1, resources: { electronics: 1, reputation: 1 }, secretProgress: 1 },
      },
      {
        id: "tower_hunters",
        at: 5,
        text: "Signal Hunters stop sounding like rumor and start sounding like a coordinated network sitting right on top of the grid.",
        effects: { radioProgress: 1, resources: { reputation: 3 } },
      },
    ],
  },
  {
    id: "sublevel_echo",
    label: "Sublevel Echo",
    short: "maintenance routes",
    description: "Track maintenance routes, drowned service lines, and concrete that still breathes on the band.",
    traceLabel: "Sublevel trace",
    milestones: [
      {
        id: "sublevel_tunnel",
        at: 1,
        text: "Flood-control calls line up into a maintenance route beneath the streets.",
        effects: { radioProgress: 1, unlockZones: ["flooded_tunnel"] },
      },
      {
        id: "sublevel_breath",
        at: 3,
        text: "A sealed air-handling loop opens for a second, then cuts out before you can answer it.",
        effects: { secretProgress: 1 },
      },
      {
        id: "sublevel_bunker",
        at: 5,
        text: "The sublevel pattern repeats around a hardened door schedule. There is a bunker route under the city after all.",
        effects: { radioProgress: 1, secretProgress: 1, setFlags: { bunkerRouteKnown: true }, unlockZones: ["hidden_bunker_entrance"] },
      },
    ],
  },
  {
    id: "anomaly_trace",
    label: "Anomaly Trace",
    short: "impossible carrier",
    description: "Push past archive noise and track the places where static behaves like a living system.",
    traceLabel: "Anomaly trace",
    milestones: [
      {
        id: "anomaly_orchard",
        at: 1,
        text: "A child's voice keeps naming a place called the Glass Orchard like it expects you to know the way.",
        effects: { secretProgress: 1, unlockZones: ["glass_orchard"] },
      },
      {
        id: "anomaly_relic",
        at: 3,
        text: "The trace stabilizes long enough to pull a relic-bearing carrier out of the hiss.",
        effects: { radioProgress: 1, resources: { relics: 1 } },
      },
      {
        id: "anomaly_dead_static",
        at: 5,
        text: "The anomaly layer stops acting like weather and starts acting like infrastructure. The static was built.",
        effects: { radioProgress: 1, secretProgress: 1 },
      },
    ],
  },
];

const RADIO_INVESTIGATIONS_BY_ID = Object.fromEntries(RADIO_INVESTIGATIONS.map((investigation) => [investigation.id, investigation]));

const SEARCH_LOOT_TABLE = [
  {
    id: "loot_scrap",
    type: "resource",
    key: "scrap",
    amount: [1, 3],
    rarity: "common",
    weight: 28,
  },
  {
    id: "loot_cloth",
    type: "resource",
    key: "cloth",
    amount: [1, 2],
    rarity: "common",
    weight: 18,
  },
  {
    id: "loot_water",
    type: "resource",
    key: "water",
    amount: [1, 2],
    rarity: "common",
    weight: 16,
  },
  {
    id: "loot_food",
    type: "resource",
    key: "food",
    amount: [1, 2],
    rarity: "uncommon",
    weight: 12,
    sources: ["dead_pantries"],
  },
  {
    id: "loot_parts",
    type: "resource",
    key: "parts",
    amount: [1, 2],
    rarity: "uncommon",
    weight: 12,
    sources: ["vehicle_shells", "sealed_caches"],
  },
  {
    id: "loot_wire",
    type: "resource",
    key: "wire",
    amount: [1, 2],
    rarity: "uncommon",
    weight: 9,
    sources: ["rubble", "vehicle_shells", "signal_wrecks"],
  },
  {
    id: "loot_fuel",
    type: "resource",
    key: "fuel",
    amount: [1, 1],
    rarity: "uncommon",
    weight: 8,
    sources: ["vehicle_shells", "sealed_caches"],
  },
  {
    id: "loot_beans",
    type: "item",
    key: "canned_beans",
    amount: [1, 1],
    rarity: "uncommon",
    weight: 6,
    sources: ["dead_pantries"],
  },
  {
    id: "loot_cloth_bundle",
    type: "resource",
    key: "cloth",
    amount: [2, 3],
    rarity: "uncommon",
    weight: 5,
    requires: { searches: 5 },
    sources: ["rubble", "dead_pantries", "clinic_drawers"],
  },
  {
    id: "loot_medicine",
    type: "resource",
    key: "medicine",
    amount: [1, 1],
    rarity: "rare",
    weight: 5,
    sources: ["dead_pantries", "clinic_drawers"],
  },
  {
    id: "loot_ammo",
    type: "resource",
    key: "ammo",
    amount: [1, 2],
    rarity: "rare",
    weight: 4,
    sources: ["sealed_caches"],
  },
  {
    id: "loot_electronics",
    type: "resource",
    key: "electronics",
    amount: [1, 1],
    rarity: "rare",
    weight: 4,
    sources: ["signal_wrecks", "sealed_caches"],
  },
  {
    id: "loot_chemicals",
    type: "resource",
    key: "chemicals",
    amount: [1, 1],
    rarity: "rare",
    weight: 4,
    sources: ["clinic_drawers", "vehicle_shells"],
  },
  {
    id: "loot_sharp_metal",
    type: "item",
    key: "sharp_metal",
    amount: [1, 1],
    rarity: "rare",
    weight: 3,
    sources: ["rubble", "vehicle_shells"],
  },
  {
    id: "loot_bandage_roll",
    type: "item",
    key: "bandage_roll",
    amount: [1, 1],
    rarity: "rare",
    weight: 2,
    requires: { searches: 8 },
    sources: ["clinic_drawers", "dead_pantries"],
  },
  {
    id: "loot_road_flare",
    type: "item",
    key: "road_flare",
    amount: [1, 1],
    rarity: "rare",
    weight: 3,
    requires: { searches: 6 },
    sources: ["vehicle_shells"],
  },
  {
    id: "loot_field_filter",
    type: "item",
    key: "field_filter",
    amount: [1, 1],
    rarity: "rare",
    weight: 3,
    requires: { upgrades: ["food_search"] },
    sources: ["dead_pantries", "clinic_drawers"],
  },
  {
    id: "loot_fuel_cell",
    type: "item",
    key: "fuel_cell",
    amount: [1, 1],
    rarity: "epic",
    weight: 4,
    requires: { searches: 10 },
    sources: ["vehicle_shells", "sealed_caches"],
  },
  {
    id: "loot_clinic_case",
    type: "item",
    key: "clinic_case",
    amount: [1, 1],
    rarity: "epic",
    weight: 3,
    requires: { upgrades: ["first_aid_rag", "crafting_bench"] },
    sources: ["clinic_drawers"],
  },
  {
    id: "loot_electronics_cache",
    type: "resource",
    key: "electronics",
    amount: [2, 3],
    rarity: "epic",
    weight: 3,
    requires: { upgrades: ["crafting_bench"] },
    sources: ["signal_wrecks", "sealed_caches"],
  },
  {
    id: "loot_pry_bar",
    type: "item",
    key: "pry_bar",
    amount: [1, 1],
    rarity: "epic",
    weight: 3,
    requires: { searches: 12, upgrades: ["crafting_bench"] },
    sources: ["rubble", "vehicle_shells", "sealed_caches"],
  },
  {
    id: "loot_coil_spike",
    type: "item",
    key: "coil_spike",
    amount: [1, 1],
    rarity: "epic",
    weight: 2,
    requires: { radioProgress: 1, upgrades: ["crafting_bench"] },
    sources: ["signal_wrecks"],
  },
  {
    id: "loot_patchwork_vest",
    type: "item",
    key: "patchwork_vest",
    amount: [1, 1],
    rarity: "legendary",
    weight: 2,
    requires: { searches: 16, upgrades: ["armor_hooks"] },
    sources: ["sealed_caches"],
  },
  {
    id: "loot_transit_pistol",
    type: "item",
    key: "transit_pistol",
    amount: [1, 1],
    rarity: "legendary",
    weight: 2,
    requires: { searches: 16, upgrades: ["weapon_rack"] },
    sources: ["sealed_caches"],
  },
  {
    id: "loot_tower_battery",
    type: "item",
    key: "tower_battery",
    amount: [1, 1],
    rarity: "legendary",
    weight: 2,
    requires: { radioProgress: 2, upgrades: ["radio_rig"] },
    sources: ["signal_wrecks"],
  },
  {
    id: "loot_relics",
    type: "resource",
    key: "relics",
    amount: [1, 1],
    rarity: "legendary",
    weight: 3,
    requires: { radioProgress: 4 },
    sources: ["signal_wrecks"],
  },
  {
    id: "loot_odd_relic",
    type: "item",
    key: "odd_relic",
    amount: [1, 1],
    rarity: "anomalous",
    weight: 2,
    requires: { secretProgress: 2 },
    sources: ["signal_wrecks"],
  },
  {
    id: "loot_static_lens",
    type: "item",
    key: "static_lens",
    amount: [1, 1],
    rarity: "mythic",
    weight: 1,
    requires: { flags: ["worldReveal"] },
    sources: ["signal_wrecks"],
  },
];


// events.js
const EVENTS = [
  {
    id: "search_broken_meter",
    pool: "search",
    weight: 10,
    text: "A broken parking meter gives up a fistful of coins and screws.",
    effects: { resources: { scrap: 2 } },
  },
  {
    id: "search_soup_tin",
    pool: "search",
    weight: 8,
    text: "Under cracked plaster: a dented tin with something that still counts as food.",
    effects: { resources: { food: 1 }, discoverResources: ["food"] },
  },
  {
    id: "search_loose_copper",
    pool: "search",
    weight: 7,
    text: "A wall peels back and exposes copper the city forgot to protect.",
    effects: { resources: { wire: 1, parts: 1 }, discoverResources: ["wire", "parts"] },
  },
  {
    id: "search_alarm",
    pool: "search",
    weight: 6,
    text: "An old alarm screams once when you move the rubble. So do you.",
    effects: { resources: { scrap: 1 }, condition: -3 },
  },
  {
    id: "search_blanket",
    pool: "search",
    weight: 6,
    text: "Half a burnt blanket and a lighter. Good enough for a colder plan.",
    effects: { resources: { fuel: 1, cloth: 1 }, discoverResources: ["fuel", "cloth"] },
  },
  {
    id: "search_clinic_token",
    pool: "search",
    weight: 5,
    text: "A clinic drawer gives you alcohol wipes and a shiver.",
    effects: { resources: { medicine: 1 }, discoverResources: ["medicine"] },
  },
  {
    id: "search_torn_canvas",
    pool: "search",
    weight: 5,
    text: "A bus seat tears clean. The cloth and straps survive better than the passengers did.",
    effects: { resources: { cloth: 2 }, discoverResources: ["cloth"] },
  },
  {
    id: "search_sharp_metal",
    pool: "search",
    weight: 5,
    text: "A bent road sign snaps along a clean edge. One side is suddenly useful.",
    effects: { grantItems: { sharp_metal: 1 } },
  },
  {
    id: "search_satchel",
    pool: "search",
    weight: 4,
    text: "A school satchel survives with one unopened can inside.",
    effects: { grantItems: { canned_beans: 1 } },
  },
  {
    id: "search_funny_poster",
    pool: "search",
    weight: 4,
    text: "You find a poster that says STAY CALM in six torn pieces. Funny enough.",
    effects: { condition: 1 },
  },
  {
    id: "search_transistor",
    pool: "search",
    weight: 3,
    text: "A pocket transistor spits a second of speech before dying again.",
    effects: { resources: { parts: 1, electronics: 1 }, radioProgress: 1, discoverResources: ["parts", "electronics"] },
  },
  {
    id: "search_neighbor",
    pool: "search",
    weight: 3,
    text: "A dead neighbor still has a keyring and a note that says 'don't trust the tower'.",
    effects: { resources: { scrap: 1, parts: 1 }, discoverResources: ["parts"] },
  },
  {
    id: "food_cellar_jar",
    pool: "food",
    weight: 8,
    text: "Behind a broken cabinet: preserved vegetables gone soft but not hostile.",
    effects: { resources: { food: 2 } },
  },
  {
    id: "food_rat_run",
    pool: "food",
    weight: 6,
    text: "You corner a rat and lose some dignity catching dinner.",
    effects: { resources: { food: 2 }, condition: -2 },
  },
  {
    id: "food_rooftop_greens",
    pool: "food",
    weight: 4,
    text: "Someone once grew herbs on a roof. Something still grows there.",
    effects: { resources: { food: 1, morale: 1 } },
  },
  {
    id: "food_mold_bin",
    pool: "food",
    weight: 4,
    text: "A whole crate, ruined except for one sealed corner.",
    effects: { resources: { food: 1, morale: -1 } },
  },
  {
    id: "travel_cautious_drain",
    pool: "travel:cautious",
    weight: 6,
    text: "You wait out movement in a stairwell and arrive later, but not noticed.",
    effects: { condition: 1 },
  },
  {
    id: "travel_cautious_cache",
    pool: "travel:cautious",
    weight: 4,
    text: "Moving slow lets you spot a tucked-away service locker on the way.",
    effects: { resources: { parts: 1, water: 1 }, discoverResources: ["parts", "water"] },
  },
  {
    id: "travel_standard_detour",
    pool: "travel:standard",
    weight: 6,
    text: "A collapsed stairwell forces a detour through old offices and scattered files.",
    effects: { resources: { cloth: 1, scrap: 1 }, discoverResources: ["cloth"] },
  },
  {
    id: "travel_standard_standoff",
    pool: "travel:standard",
    weight: 4,
    text: "You freeze while something sniffs the air two rooms away, then move when it loses interest.",
    effects: { condition: -1 },
  },
  {
    id: "travel_forced_break",
    pool: "travel:forced",
    weight: 6,
    text: "You smash a chain latch to save time. The echo buys speed and future problems.",
    effects: { resources: { scrap: 1 }, condition: -2 },
  },
  {
    id: "travel_forced_score",
    pool: "travel:forced",
    weight: 4,
    text: "The loud route pays once: an exposed supply crate left where caution would miss it.",
    effects: { resources: { ammo: 1, parts: 1 }, discoverResources: ["ammo", "parts"] },
  },
  {
    id: "night_first",
    pool: "night",
    weight: 10,
    once: true,
    text: "First night. Every scrape outside sounds deliberate.",
    effects: { condition: -5, resources: { morale: -1 }, setFlags: { firstNightResolved: true } },
  },
  {
    id: "night_boards_hold",
    pool: "night",
    weight: 7,
    text: "Something tests the barricade, then loses interest or patience.",
    effects: { condition: 2 },
  },
  {
    id: "night_fingers_under_door",
    pool: "night",
    weight: 6,
    text: "Fingers feel along the gap under the door. You don't breathe until dawn.",
    effects: { condition: -3, resources: { morale: -1 } },
  },
  {
    id: "night_warm_embers",
    pool: "night",
    weight: 5,
    requires: { upgrades: ["campfire"] },
    text: "The fire burns low and steady. For one hour, the world stays outside.",
    effects: { condition: 3, resources: { morale: 1 } },
  },
  {
    id: "night_raider_shadow",
    pool: "night",
    weight: 4,
    requires: { day: 5 },
    text: "A lantern flash, hushed swearing, boots fading into alleys. Raiders are testing routes.",
    effects: { resources: { reputation: 1 }, secretProgress: 1 },
  },
  {
    id: "night_choir_dream",
    pool: "night",
    weight: 3,
    requires: { radioProgress: 3 },
    text: "You dream in station IDs and wake with your teeth aching.",
    effects: { condition: -2, radioProgress: 1 },
  },
  {
    id: "radio_numbers_station",
    pool: "radio",
    weight: 9,
    once: true,
    text: "A calm voice counts down to an evacuation that never came.",
    effects: { radioProgress: 1, resources: { reputation: 1 }, unlockSections: ["radio"] },
  },
  {
    id: "radio_drowned_dispatch",
    pool: "radio",
    weight: 8,
    once: true,
    text: "A waterlogged dispatch mentions maintenance routes beneath the city.",
    effects: { radioProgress: 1, unlockZones: ["flooded_tunnel"] },
  },
  {
    id: "radio_hospital_page",
    pool: "radio",
    weight: 7,
    once: true,
    text: "An endless hospital page repeats a wing number long after staff stopped answering.",
    effects: { radioProgress: 1, unlockZones: ["hospital_wing"] },
  },
  {
    id: "radio_tower_offer",
    pool: "radio",
    weight: 6,
    once: true,
    text: "A clipped transmission offers safe passage near the tower in exchange for 'cooperation'.",
    effects: { radioProgress: 1, unlockZones: ["radio_tower_perimeter"], unlockSections: ["factions"] },
  },
  {
    id: "radio_lantern_market",
    pool: "radio",
    weight: 6,
    once: true,
    text: "A trader signal bursts through: three tones, a price, and the smell of kerosene in your head.",
    effects: { radioProgress: 1, unlockSections: ["trader"] },
  },
  {
    id: "radio_orchard",
    pool: "radio",
    weight: 4,
    requires: { radioProgress: 4 },
    once: true,
    text: "A child whispers directions to a place called the Glass Orchard, then laughs when you repeat it back.",
    effects: { secretProgress: 1, unlockZones: ["glass_orchard"] },
  },
  {
    id: "radio_bunker_breath",
    pool: "radio",
    weight: 4,
    requires: { radioProgress: 4, items: ["relay_key"] },
    once: true,
    text: "A sealed channel opens for half a second. Air pumps. Concrete. Someone says 'breach team'.",
    effects: { secretProgress: 1, unlockZones: ["hidden_bunker_entrance"] },
  },
  {
    id: "radio_dead_static",
    pool: "radio",
    weight: 2,
    requires: { secretProgress: 3, items: ["bunker_pass"] },
    once: true,
    text: "The pattern resolves: the static was never random. It was a command layer talking through the dead.",
    effects: { radioProgress: 2, secretProgress: 1, setFlags: { worldReveal: true } },
  },
  {
    id: "radio_civic_hiss",
    pool: "radio:civic_band",
    weight: 6,
    text: "A public-address hiss keeps swallowing whole street names, but not the fear in the speaker's voice.",
    effects: { resources: { reputation: 1 } },
  },
  {
    id: "radio_civic_clip",
    pool: "radio:civic_band",
    weight: 4,
    text: "A clipped dispatch lists shelter capacities that were already overrun when the message was sent.",
    effects: { condition: -1, resources: { morale: 1 } },
  },
  {
    id: "radio_tower_pulse",
    pool: "radio:tower_grid",
    weight: 6,
    text: "The tower grid coughs up a maintenance pulse that sounds more recent than it has any right to be.",
    effects: { resources: { electronics: 1 } },
  },
  {
    id: "radio_tower_ghost",
    pool: "radio:tower_grid",
    weight: 4,
    text: "Someone on the relay net says your district name, waits, and never repeats it.",
    effects: { resources: { reputation: 1 }, condition: -1 },
  },
  {
    id: "radio_sublevel_drain",
    pool: "radio:sublevel_echo",
    weight: 6,
    text: "Pumps cycle somewhere under the streets and the band catches every heavy breath of them.",
    effects: { resources: { parts: 1 } },
  },
  {
    id: "radio_sublevel_steps",
    pool: "radio:sublevel_echo",
    weight: 4,
    text: "Concrete steps count themselves off on the receiver, as if someone is still taking inventory below.",
    effects: { condition: -1, resources: { morale: 1 } },
  },
  {
    id: "radio_anomaly_bloom",
    pool: "radio:anomaly_trace",
    weight: 6,
    text: "The signal blooms into a perfect carrier for half a second, then collapses back into living static.",
    effects: { resources: { relics: 1 } },
  },
  {
    id: "radio_anomaly_voice",
    pool: "radio:anomaly_trace",
    weight: 4,
    text: "A child's voice asks whether the city still remembers its own emergency codes, then laughs when you answer.",
    effects: { condition: -2, resources: { morale: 1 } },
  },
  {
    id: "zone_ruined_bus",
    pool: "zone:ruined_street",
    weight: 6,
    text: "Inside a crushed bus, someone left a toolkit under the driver's seat.",
    effects: { resources: { parts: 2 } },
  },
  {
    id: "zone_ruined_market",
    pool: "zone:ruined_street",
    weight: 4,
    text: "A shattered market stall still has beans sealed behind warped metal.",
    effects: { grantItems: { canned_beans: 1 } },
  },
  {
    id: "zone_apartment_note",
    pool: "zone:burned_apartments",
    weight: 5,
    text: "A soot-black family note says the noise came before the bite.",
    effects: { resources: { morale: 1 }, radioProgress: 1 },
  },
  {
    id: "zone_apartment_cache",
    pool: "zone:burned_apartments",
    weight: 5,
    text: "A bathtub cache gives up medicine and a dry roll of bandages.",
    effects: { resources: { medicine: 1 }, grantItems: { bandage_roll: 1 } },
  },
  {
    id: "zone_gas_siphon",
    pool: "zone:abandoned_gas_station",
    weight: 6,
    text: "You find a tank with enough fumes left to count.",
    effects: { resources: { fuel: 2 } },
  },
  {
    id: "zone_gas_trader_mark",
    pool: "zone:abandoned_gas_station",
    weight: 4,
    text: "Someone marked the wall with lantern symbols and a price code.",
    effects: { resources: { reputation: 1 }, unlockSections: ["trader"] },
  },
  {
    id: "zone_tunnel_case",
    pool: "zone:flooded_tunnel",
    weight: 5,
    text: "A waterproof case is wedged in the concrete seam.",
    effects: { resources: { ammo: 2, parts: 1 }, discoverResources: ["ammo"] },
  },
  {
    id: "zone_tunnel_key",
    pool: "zone:flooded_tunnel",
    weight: 4,
    once: true,
    text: "Behind a service hatch: a relay key in an oilskin pouch.",
    effects: { grantItems: { relay_key: 1 }, secretProgress: 1 },
  },
  {
    id: "zone_hospital_archive",
    pool: "zone:hospital_wing",
    weight: 5,
    text: "Triage logs mention patients responding to frequencies before symptoms.",
    effects: { resources: { medicine: 2, chemicals: 1 }, radioProgress: 1, discoverResources: ["chemicals"] },
  },
  {
    id: "zone_hospital_crash_cart",
    pool: "zone:hospital_wing",
    weight: 4,
    text: "A crash cart still rolls. So does your luck.",
    effects: { resources: { medicine: 1, chemicals: 1 }, discoverResources: ["chemicals"], grantItems: { bandage_roll: 1 } },
  },
  {
    id: "zone_tower_scope",
    pool: "zone:radio_tower_perimeter",
    weight: 5,
    text: "A sniper nest overlooks streets you have already learned the hard way.",
    effects: { grantItems: { tower_rifle: 1 }, resources: { reputation: 1 } },
  },
  {
    id: "zone_tower_field",
    pool: "zone:radio_tower_perimeter",
    weight: 4,
    text: "The fence hum becomes words when you stand too close to it.",
    effects: { secretProgress: 1, resources: { relics: 1 } },
  },
  {
    id: "zone_orchard_reflection",
    pool: "zone:glass_orchard",
    weight: 6,
    text: "Every glass tree shows you somewhere else in the city, all at once.",
    effects: { resources: { relics: 1, morale: 1 }, grantItems: { odd_relic: 1 } },
  },
  {
    id: "zone_bunker_door",
    pool: "zone:hidden_bunker_entrance",
    weight: 5,
    once: true,
    text: "The concrete door opens a hand's width and exhales cold filtered air.",
    effects: { grantItems: { bunker_pass: 1 }, secretProgress: 1 },
  },
  {
    id: "zone_bunker_truth",
    pool: "zone:hidden_bunker_entrance",
    weight: 3,
    once: true,
    requires: { items: ["bunker_pass"] },
    text: "Inside, a dead operations wall shows the project name: DEAD STATIC. Signal suppression. Crowd obedience. Outbreak contingency.",
    effects: { setFlags: { worldReveal: true }, radioProgress: 2, secretProgress: 1, unlockZones: ["glass_orchard"] },
  },
];


// engine.js
const MAX_LOG_LINES = 60;
const DERIVED_NUMERIC_KEYS = [
  "maxCondition",
  "burnCondition",
  "defense",
  "searchScrapMin",
  "searchScrapMax",
  "searchFoodChance",
  "searchPartChance",
  "searchMedicineChance",
  "conditionRegen",
  "survivorCap",
  "expeditionLootBonus",
  "scoutBonus",
  "radioDepth",
  "attack",
  "searchBonusRolls",
  "rareLootBonus",
  "salvageYieldBonus",
  "forageYieldBonus",
  "expeditionEncounterAdjust",
  "signalGain",
  "anomalyGain",
  "traderDiscount",
  "nightMitigation",
  "power",
  "coverage",
  "repairPower",
  "maintenance",
  "foodSecurity",
  "waterSecurity",
  "siegeMitigation",
];

const STRUCTURE_SIGNAL_IDS = new Set(["radio_rig", "signal_decoder", "battery_bank", "trader_beacon", "faraday_mesh", "relay_tap"]);
const STRUCTURE_UTILITY_IDS = new Set(["crafting_bench", "ammo_press", "rain_collector", "bunker_drill", "repair_rig", "battery_bank", "water_still"]);
const STRUCTURE_DEFENSE_IDS = new Set(["basic_barricade", "watch_post", "tripwire_grid", "flood_lights"]);
const STRUCTURE_UPGRADE_IDS = new Set([
  "shelter_stash",
  "campfire",
  "basic_barricade",
  "food_crate",
  "crafting_bench",
  "weapon_rack",
  "armor_hooks",
  "watch_post",
  "tripwire_grid",
  "ammo_press",
  "repair_rig",
  "rain_collector",
  "water_still",
  "radio_rig",
  "battery_bank",
  "flood_lights",
  "map_board",
  "survivor_cots",
  "smokehouse",
  "trader_beacon",
  "scout_bike",
  "signal_decoder",
  "auto_scavenger",
  "faraday_mesh",
  "relay_tap",
  "bunker_drill",
]);
const SURVIVOR_TRAIT_IDS = Object.keys(SURVIVOR_TRAITS);
const PASSIVE_RESOURCE_MULTIPLIER = 0.45;
const SHELTER_ADJACENCY_BONUSES = [
  {
    id: "food_line",
    upgrades: ["food_crate", "smokehouse"],
    label: "Food line",
    effects: { forageYieldBonus: 0.06, foodSecurity: 1 },
  },
  {
    id: "water_loop",
    upgrades: ["rain_collector", "water_still"],
    label: "Water loop",
    effects: { waterSecurity: 1, conditionRegen: 0.01 },
  },
  {
    id: "repair_line",
    upgrades: ["crafting_bench", "repair_rig"],
    label: "Repair line",
    effects: { repairPower: 1, maintenance: 1 },
  },
  {
    id: "fence_watch",
    upgrades: ["watch_post", "tripwire_grid"],
    label: "Fence watch",
    effects: { defense: 1, siegeMitigation: 0.25, coverage: 0.15 },
  },
  {
    id: "lit_perimeter",
    upgrades: ["watch_post", "flood_lights"],
    label: "Lit perimeter",
    effects: { defense: 1, coverage: 0.3, nightMitigation: 0.12 },
  },
  {
    id: "radio_stack",
    upgrades: ["radio_rig", "signal_decoder"],
    label: "Radio stack",
    effects: { signalGain: 0.1, radioDepth: 0.15, coverage: 0.25 },
  },
  {
    id: "powered_signal",
    upgrades: ["radio_rig", "battery_bank"],
    label: "Powered signal",
    effects: { power: 1, signalGain: 0.05 },
  },
  {
    id: "relay_spine",
    upgrades: ["trader_beacon", "relay_tap"],
    label: "Relay spine",
    effects: { coverage: 0.2, signalGain: 0.06, anomalyGain: 0.08 },
  },
  {
    id: "warm_beds",
    upgrades: ["survivor_cots", "campfire"],
    label: "Warm beds",
    effects: { conditionRegen: 0.01, moraleGuard: 1 },
  },
];

const NIGHT_PLANS = {
  low_profile: {
    id: "low_profile",
    label: "Low Profile",
    description: "Kill the glow, keep voices low, and let the outside pass by.",
    defense: -1,
    noise: -0.85,
    raidBias: -0.06,
    breachBias: 0.02,
    morale: 1,
  },
  hold_fast: {
    id: "hold_fast",
    label: "Hold Fast",
    description: "Board the line, hold the center, and trust the shelter to do its job.",
    defense: 0,
    noise: 0,
    raidBias: 0,
    breachBias: 0,
    morale: 0,
  },
  counter_watch: {
    id: "counter_watch",
    label: "Counter Watch",
    description: "Keep eyes on the perimeter and answer movement before it reaches the door.",
    defense: 2,
    noise: 0.55,
    raidBias: 0.06,
    breachBias: -0.04,
    morale: -1,
  },
};

function survivorName(index) {
  return SURVIVOR_NAME_POOL[index % SURVIVOR_NAME_POOL.length];
}

function normalizeSurvivorRole(roleId) {
  return roleId && (roleId === "idle" || SURVIVOR_ROLES[roleId]) ? roleId : "idle";
}

function normalizeSurvivorRecord(survivor, index) {
  return {
    id: survivor?.id || `survivor-${index + 1}`,
    name: survivor?.name || survivorName(index),
    traitId: SURVIVOR_TRAITS[survivor?.traitId] ? survivor.traitId : SURVIVOR_TRAIT_IDS[index % SURVIVOR_TRAIT_IDS.length],
    role: normalizeSurvivorRole(survivor?.role),
    wounded: Math.max(0, survivor?.wounded || 0),
    stress: Math.max(0, survivor?.stress || 0),
  };
}

function syncSurvivorRoster(state) {
  const roster = Array.isArray(state.survivors.roster) ? state.survivors.roster : [];
  state.survivors.roster = roster.map((survivor, index) => normalizeSurvivorRecord(survivor, index));
  const assigned = Object.fromEntries(Object.keys(SURVIVOR_ROLES).map((roleId) => [roleId, 0]));
  let idle = 0;

  state.survivors.roster.forEach((survivor) => {
    if (survivor.role !== "idle" && assigned[survivor.role] !== undefined) {
      assigned[survivor.role] += 1;
    } else {
      idle += 1;
      survivor.role = "idle";
    }
  });

  state.survivors.total = state.survivors.roster.length;
  state.survivors.idle = idle;
  state.survivors.assigned = assigned;
}

function idleSurvivor(state) {
  syncSurvivorRoster(state);
  return state.survivors.roster.find((survivor) => survivor.role === "idle") || null;
}

function assignedSurvivor(state, roleId) {
  syncSurvivorRoster(state);
  return state.survivors.roster.find((survivor) => survivor.role === roleId) || null;
}

function survivorWorkFactor(survivor) {
  const woundPenalty = survivor.wounded >= 2 ? 0.45 : survivor.wounded === 1 ? 0.22 : 0;
  const stressPenalty = survivor.stress >= 7 ? 0.28 : survivor.stress >= 4 ? 0.12 : 0;
  return clamp(1 - woundPenalty - stressPenalty, 0.2, 1);
}

function rosterCandidates(state, preferredRoles = []) {
  syncSurvivorRoster(state);
  const roster = state.survivors.roster;
  const preferred = roster.filter((survivor) => preferredRoles.includes(survivor.role));
  return preferred.length ? preferred : roster;
}

function applySurvivorStress(state, amount = 1, preferredRoles = []) {
  const candidates = rosterCandidates(state, preferredRoles);
  const target = pickOne(candidates);
  if (!target) {
    return null;
  }

  target.stress = clamp(target.stress + amount, 0, 10);
  return target;
}

function applySurvivorWound(state, amount = 1, preferredRoles = []) {
  const candidates = rosterCandidates(state, preferredRoles);
  const target = pickOne(candidates);
  if (!target) {
    return null;
  }

  target.wounded = clamp(target.wounded + amount, 0, 3);
  return target;
}

function maybeTriggerCrewConflict(state) {
  syncSurvivorRoster(state);
  const strained = state.survivors.roster.filter((survivor) => survivor.stress >= 7);
  if (!strained.length || !chance(clamp(0.08 + strained.length * 0.06, 0.08, 0.4))) {
    return null;
  }

  const instigator = pickOne(strained);
  if (!instigator) {
    return null;
  }

  state.resources.morale = Math.max(0, state.resources.morale - 2);
  state.shelter.noise = clamp(state.shelter.noise + 0.28, 0, 10);
  instigator.stress = Math.max(0, instigator.stress - 2);
  addLog(state, `${instigator.name} snaps at the shelter line. The room gets louder and nobody feels steadier for it.`, "crew");
  return instigator;
}

function recoverSurvivorsAtDawn(state) {
  syncSurvivorRoster(state);
  const medicFactor = state.survivors.assigned.medic + (hasItem(state, "clinic_case") ? 1 : 0);
  if (!state.survivors.roster.length) {
    return;
  }

  const recovered = [];
  const steadied = [];
  state.survivors.roster.forEach((survivor) => {
    if (survivor.wounded > 0) {
      const canRecover = medicFactor > 0 || chance(0.18);
      if (canRecover && (medicFactor > 0 || survivor.wounded === 1)) {
        survivor.wounded = Math.max(0, survivor.wounded - 1);
        recovered.push(survivor.name);
      }
    }
    if (survivor.stress > 0) {
      const drop = 1 + (medicFactor > 0 ? 1 : 0);
      survivor.stress = Math.max(0, survivor.stress - drop);
      if (drop > 0) {
        steadied.push(survivor.name);
      }
    }
  });

  if (recovered.length) {
    addLog(state, `${recovered.join(", ")} patch up enough to stand a little cleaner at dawn.`, "crew");
  }
  if (steadied.length && chance(0.3)) {
    addLog(state, "Dawn takes some of the edge off the room. Nobody feels safe, but a few people stop shaking.", "crew");
  }
}

function survivorTraitBonuses(state) {
  syncSurvivorRoster(state);
  const totals = {
    attack: 0,
    defense: 0,
    salvageYieldBonus: 0,
    scavengeNoiseReduction: 0,
    forageYieldBonus: 0,
    conditionRegen: 0,
    expeditionLootBonus: 0,
    expeditionEncounterAdjust: 0,
    scoutBonus: 0,
    signalGain: 0,
    anomalyGain: 0,
    traderDiscount: 0,
    nightMitigation: 0,
    moraleGuard: 0,
    coverage: 0,
    repairPower: 0,
    maintenance: 0,
  };

  state.survivors.roster.forEach((survivor) => {
    const trait = SURVIVOR_TRAITS[survivor.traitId];
    if (!trait) {
      return;
    }

    if (trait.role === survivor.role) {
      const factor = survivorWorkFactor(survivor);
      switch (trait.id || survivor.traitId) {
        case "quiet_hands":
          totals.salvageYieldBonus += 0.08 * factor;
          totals.scavengeNoiseReduction += 0.08 * factor;
          break;
        case "pack_rat":
          totals.salvageYieldBonus += 0.12 * factor;
          break;
        case "hard_case":
          totals.defense += 1 * factor;
          totals.nightMitigation += 0.45 * factor;
          break;
        case "lantern_nerve":
          totals.nightMitigation += 0.2 * factor;
          totals.moraleGuard += 1 * factor;
          break;
        case "patch_saint":
          totals.conditionRegen += 0.03 * factor;
          totals.repairPower += 0.25 * factor;
          break;
        case "bone_saw":
          totals.conditionRegen += 0.04 * factor;
          totals.repairPower += 0.3 * factor;
          totals.moraleGuard -= 1 * factor;
          break;
        case "pathfinder":
          totals.expeditionEncounterAdjust -= 0.04 * factor;
          totals.scoutBonus += 0.04 * factor;
          totals.coverage += 0.08 * factor;
          break;
        case "breaker":
          totals.expeditionLootBonus += 0.06 * factor;
          totals.attack += 1 * factor;
          break;
        case "ghost_ear":
          totals.signalGain += 0.2 * factor;
          totals.coverage += 0.08 * factor;
          break;
        case "odd_frequency":
          totals.signalGain += 0.08 * factor;
          totals.anomalyGain += 0.24 * factor;
          totals.coverage += 0.06 * factor;
          totals.moraleGuard -= 1 * factor;
          break;
        default:
          break;
      }
    }
  });

  return totals;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
  return Math.random() < probability;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pickOne(list) {
  return list.length ? list[randInt(0, list.length - 1)] : null;
}

function hourStamp(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getTimeStamp(state) {
  return `D${state.time.day} ${hourStamp(state.time.hour)}`;
}

function getShelterUpkeep(state) {
  const crew = Math.max(0, state.survivors?.total || 0);
  const mealCost = Math.max(1, 1 + Math.floor(crew / 2));
  const waterCost = Math.max(1, 1 + Math.ceil(crew / 2));
  const builtCount = Math.max(0, builtStructureKeys(state).length - 1);
  const maintenanceWood = Math.max(0, Math.floor(Math.max(0, builtCount - 3) / 4));
  const maintenanceParts = Math.max(0, Math.floor(Math.max(0, builtCount - 6) / 5));

  return {
    crew,
    mealHours: 6,
    waterHours: 4,
    maintenanceHours: 8,
    mealCost,
    waterCost,
    maintenanceWood,
    maintenanceParts,
    mealHoursLeft: Math.max(0, 6 - state.clocks.hunger),
    waterHoursLeft: Math.max(0, 4 - state.clocks.thirst),
    maintenanceHoursLeft: Math.max(0, 8 - state.clocks.maintenance),
  };
}

function adjacencyBonuses(state) {
  return SHELTER_ADJACENCY_BONUSES.filter((bonus) => bonus.upgrades.every((upgradeId) => state.upgrades.includes(upgradeId)));
}

function getShelterSystems(state, derived = getDerivedState(state)) {
  const upkeep = getShelterUpkeep(state);
  const builtCount = Math.max(0, builtStructureKeys(state).length - 1);
  const damagedCount = Object.keys(state.shelter.damage || {}).filter((structureId) => getStructureDamage(state, structureId) > 0).length;
  const powerDemand = [
    "radio_rig",
    "signal_decoder",
    "trader_beacon",
    "relay_tap",
    "flood_lights",
    "repair_rig",
    "ammo_press",
    "bunker_drill",
  ].filter((upgradeId) => state.upgrades.includes(upgradeId)).length;
  const powerSupply = Math.max(
    0,
    1
      + derived.power
      + (hasItem(state, "tower_battery") ? 1 : 0)
      + (state.resources.fuel >= 2 && state.upgrades.includes("campfire") ? 1 : 0),
  );
  const coverage = clamp(
    1
      + derived.coverage
      + (state.upgrades.includes("watch_post") ? 1.2 : 0)
      + state.survivors.assigned.scout * 0.2
      + state.survivors.assigned.tuner * 0.25,
    0,
    12,
  );
  const maintenanceLoad = builtCount * 0.45 + damagedCount * 1.25 + upkeep.crew * 0.2;
  const maintenanceSupport = derived.maintenance + derived.repairPower + state.survivors.assigned.medic * 0.35;
  const maintenanceBalance = Number((maintenanceSupport - maintenanceLoad).toFixed(2));
  const foodInflow = Number((derived.passive.food + derived.forageYieldBonus * 0.12 + derived.foodSecurity * 0.12).toFixed(2));
  const waterInflow = Number((derived.passive.water + derived.waterSecurity * 0.14).toFixed(2));
  const foodDrain = Number((upkeep.mealCost / upkeep.mealHours).toFixed(2));
  const waterDrain = Number((upkeep.waterCost / upkeep.waterHours).toFixed(2));
  const powerGap = Math.max(0, powerDemand - powerSupply);

  return {
    builtCount,
    damagedCount,
    powerSupply,
    powerDemand,
    powerGap,
    powerState: powerGap <= 0 ? "stable" : powerGap <= 1 ? "thin" : "dark",
    coverage,
    maintenanceLoad: Number(maintenanceLoad.toFixed(2)),
    maintenanceSupport: Number(maintenanceSupport.toFixed(2)),
    maintenanceBalance,
    maintenanceState: maintenanceBalance >= 0.75 ? "stable" : maintenanceBalance >= -0.35 ? "strained" : "failing",
    foodInflow,
    foodDrain,
    foodFlow: Number((foodInflow - foodDrain).toFixed(2)),
    waterInflow,
    waterDrain,
    waterFlow: Number((waterInflow - waterDrain).toFixed(2)),
    adjacency: adjacencyBonuses(state),
  };
}

function addLog(state, text, category = "general") {
  state.log.unshift({
    stamp: getTimeStamp(state),
    text,
    category,
  });
  state.log = state.log.slice(0, MAX_LOG_LINES);
}

function markEventSeen(state, eventId) {
  if (!state.seenEvents.includes(eventId)) {
    state.seenEvents.push(eventId);
  }
}

function hasUpgrade(state, upgradeId) {
  return state.upgrades.includes(upgradeId);
}

function structureKey(structureId) {
  return structureId || "shelter_core";
}

function getStructureDamage(state, structureId) {
  return state.shelter.damage?.[structureKey(structureId)] || 0;
}

function setStructureDamage(state, structureId, value) {
  const key = structureKey(structureId);
  state.shelter.damage[key] = clamp(Math.round(value), 0, 3);
  if (state.shelter.damage[key] <= 0) {
    delete state.shelter.damage[key];
  }
}

function addStructureDamage(state, structureId, amount = 1) {
  setStructureDamage(state, structureId, getStructureDamage(state, structureId) + amount);
}

function builtStructureKeys(state) {
  const keys = ["shelter_core"];
  state.upgrades.forEach((upgradeId) => {
    if (STRUCTURE_UPGRADE_IDS.has(upgradeId)) {
      keys.push(upgradeId);
    }
  });
  return [...new Set(keys)];
}

function pickDamageTarget(state, preferred = []) {
  const available = [...new Set([...preferred, ...builtStructureKeys(state)])];
  return pickOne(available.filter(Boolean)) || "shelter_core";
}

function damageLabel(key) {
  if (key === "basic_barricade") {
    return "Perimeter Fence";
  }
  if (key === "shelter_core") {
    return "Held Room";
  }
  return UPGRADES_BY_ID[key]?.name || key;
}

function damagePartsCost(structureId) {
  if (STRUCTURE_SIGNAL_IDS.has(structureId)) {
    return { parts: 1, wire: 1 };
  }
  if (STRUCTURE_UTILITY_IDS.has(structureId)) {
    return { parts: 1 };
  }
  if (STRUCTURE_DEFENSE_IDS.has(structureId)) {
    return { parts: 1 };
  }
  return {};
}

function getRepairCost(state, structureId) {
  const damage = getStructureDamage(state, structureId);
  if (damage <= 0) {
    return {};
  }

  const cost = {
    scrap: 3 + damage * 2,
    ...damagePartsCost(structureId),
  };
  if (hasItem(state, "carpenter_kit")) {
    cost.scrap = Math.max(2, cost.scrap - 1);
  }
  if (hasItem(state, "hand_drill") && cost.parts) {
    cost.parts = Math.max(0, cost.parts - 1);
    if (cost.parts === 0) {
      delete cost.parts;
    }
  }
  return cost;
}

function repairStructure(state, structureId) {
  const cost = getRepairCost(state, structureId);
  if (!Object.keys(cost).length || !canAfford(state, cost)) {
    return false;
  }

  spendResources(state, cost);
  const repairDepth = 1 + (hasItem(state, "carpenter_kit") ? 1 : 0) + (hasItem(state, "hand_drill") ? 1 : 0);
  setStructureDamage(state, structureId, getStructureDamage(state, structureId) - repairDepth);
  addLog(
    state,
    `You shore up ${damageLabel(structureId)} before the next bad night remembers it${repairDepth > 1 ? ", fixing more than one weak seam in the process" : ""}.`,
    "build",
  );
  return true;
}

function hasItem(state, itemId) {
  return (state.inventory[itemId] || 0) > 0;
}

function discoverResource(state, resourceId) {
  if (!RESOURCE_DEFS[resourceId]) {
    return;
  }

  if (!state.discoveredResources.includes(resourceId)) {
    state.discoveredResources.push(resourceId);
  }
}

function unlockSection(state, sectionId, text) {
  if (!state.unlockedSections.includes(sectionId)) {
    state.unlockedSections.push(sectionId);
    if (text) {
      addLog(state, text);
    }
  }
}

function unlockZone(state, zoneId, text) {
  if (!ZONES_BY_ID[zoneId]) {
    return;
  }

  if (!state.unlockedZones.includes(zoneId)) {
    state.unlockedZones.push(zoneId);
    if (text) {
      addLog(state, text);
    }
  }
}

function mergeEffectsIntoDerived(derived, effects = {}) {
  DERIVED_NUMERIC_KEYS.forEach((key) => {
    if (typeof effects[key] === "number") {
      derived[key] += effects[key];
    }
  });

  if (effects.passive) {
    Object.entries(effects.passive).forEach(([resourceId, amount]) => {
      derived.passive[resourceId] += amount * PASSIVE_RESOURCE_MULTIPLIER;
    });
  }

  if (effects.weaponSlot) {
    derived.weaponSlot = true;
  }

  if (effects.armorSlot) {
    derived.armorSlot = true;
  }
}

function getDerivedState(state) {
  syncSurvivorRoster(state);
  const derived = {
    maxCondition: 100,
    burnCondition: 12,
    defense: 0,
    searchScrapMin: 1,
    searchScrapMax: 4,
    searchFoodChance: 0.04,
    searchPartChance: 0.03,
    searchMedicineChance: 0.01,
    conditionRegen: 0,
    survivorCap: 0,
    expeditionLootBonus: 0,
    scoutBonus: 0,
    radioDepth: 0,
    attack: 2,
    searchBonusRolls: 0,
    rareLootBonus: 0,
    salvageYieldBonus: 0,
    forageYieldBonus: 0,
    expeditionEncounterAdjust: 0,
    signalGain: 0,
    anomalyGain: 0,
    traderDiscount: 0,
    nightMitigation: 0,
    power: 0,
    coverage: 0,
    repairPower: 0,
    maintenance: 0,
    foodSecurity: 0,
    waterSecurity: 0,
    siegeMitigation: 0,
    weaponSlot: false,
    armorSlot: false,
    passive: Object.fromEntries(RESOURCE_ORDER.map((resourceId) => [resourceId, 0])),
  };

  state.upgrades.forEach((upgradeId) => {
    mergeEffectsIntoDerived(derived, UPGRADES_BY_ID[upgradeId]?.effects);
  });

  const effectiveRoles = {
    scavenger: 0,
    guard: 0,
    medic: 0,
    scout: 0,
    tuner: 0,
  };
  state.survivors.roster.forEach((survivor) => {
    if (!Object.prototype.hasOwnProperty.call(effectiveRoles, survivor.role)) {
      return;
    }
    effectiveRoles[survivor.role] += survivorWorkFactor(survivor);
  });

  derived.salvageYieldBonus += effectiveRoles.scavenger * 0.06;
  derived.defense += effectiveRoles.guard;
  derived.conditionRegen += effectiveRoles.medic * 0.02;
  derived.expeditionLootBonus += effectiveRoles.scout * 0.08;
  derived.scoutBonus += effectiveRoles.scout * 0.06;
  derived.expeditionEncounterAdjust -= effectiveRoles.scout * 0.025;
  derived.radioDepth += effectiveRoles.tuner * 0.25;
  derived.signalGain += effectiveRoles.tuner * 0.12;
  derived.coverage += effectiveRoles.guard * 0.12 + effectiveRoles.scout * 0.08 + effectiveRoles.tuner * 0.1;

  const traitBonuses = survivorTraitBonuses(state);
  derived.attack += traitBonuses.attack;
  derived.defense += traitBonuses.defense;
  derived.salvageYieldBonus += traitBonuses.salvageYieldBonus;
  derived.forageYieldBonus += traitBonuses.forageYieldBonus;
  derived.conditionRegen += traitBonuses.conditionRegen;
  derived.expeditionLootBonus += traitBonuses.expeditionLootBonus;
  derived.expeditionEncounterAdjust += traitBonuses.expeditionEncounterAdjust;
  derived.scoutBonus += traitBonuses.scoutBonus;
  derived.signalGain += traitBonuses.signalGain;
  derived.anomalyGain += traitBonuses.anomalyGain;
  derived.traderDiscount += traitBonuses.traderDiscount;
  derived.nightMitigation += traitBonuses.nightMitigation;
  derived.coverage += traitBonuses.coverage;
  derived.repairPower += traitBonuses.repairPower;
  derived.maintenance += traitBonuses.maintenance;

  const equippedWeapon = ITEMS[state.equipped.weapon];
  const equippedArmor = ITEMS[state.equipped.armor];
  if (equippedWeapon?.attack) {
    derived.attack += equippedWeapon.attack;
  }
  if (equippedArmor?.defense) {
    derived.defense += equippedArmor.defense;
  }
  if (hasItem(state, "pry_bar")) {
    derived.salvageYieldBonus += 0.08;
    derived.searchPartChance += 0.06;
  }
  if (hasItem(state, "salvage_hatchet")) {
    derived.salvageYieldBonus += 0.04;
    derived.forageYieldBonus += 0.06;
    derived.nightMitigation += 0.12;
  }
  if (hasItem(state, "carpenter_kit")) {
    derived.repairPower += 1;
    derived.maintenance += 1;
    derived.nightMitigation += 0.1;
  }
  if (hasItem(state, "hand_drill")) {
    derived.repairPower += 1;
    derived.searchPartChance += 0.04;
    derived.coverage += 0.1;
  }
  if (hasItem(state, "signal_meter")) {
    derived.signalGain += 0.14;
    derived.radioDepth += 0.12;
    derived.coverage += 0.18;
  }

  adjacencyBonuses(state).forEach((bonus) => {
    mergeEffectsIntoDerived(derived, bonus.effects);
  });

  derived.attack += Math.floor(state.resources.morale / 4);
  derived.defense += Math.floor(state.resources.reputation / 12);
  derived.survivorCap += 1;

  return derived;
}

function requirementsMet(state, requirements = {}) {
  if (requirements.searches && state.stats.searches < requirements.searches) {
    return false;
  }
  if (requirements.burnUses && state.stats.burnUses < requirements.burnUses) {
    return false;
  }
  if (requirements.day && state.time.day < requirements.day) {
    return false;
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    return false;
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    return false;
  }
  if (requirements.survivors && state.survivors.total < requirements.survivors) {
    return false;
  }
  if (requirements.zonesVisited && state.stats.zonesVisited < requirements.zonesVisited) {
    return false;
  }
  if (requirements.reputation && state.resources.reputation < requirements.reputation) {
    return false;
  }
  if (requirements.upgrades && !requirements.upgrades.every((upgradeId) => hasUpgrade(state, upgradeId))) {
    return false;
  }
  if (requirements.items && !requirements.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  if (requirements.flags && !requirements.flags.every((flag) => state.flags[flag])) {
    return false;
  }

  return true;
}

function sourceAvailable(state, source) {
  return Boolean(source && requirementsMet(state, source.requires));
}

function getAvailableScavengeSources(state) {
  return SCAVENGE_SOURCES.filter((source) => sourceAvailable(state, source));
}

function nightPlan(state) {
  return NIGHT_PLANS[state.night.plan] || NIGHT_PLANS.hold_fast;
}

function guardStrength(state) {
  return state.survivors.assigned.guard + (hasUpgrade(state, "watch_post") ? 1 : 0);
}

function getNightForecast(state) {
  const derived = getDerivedState(state);
  const systems = getShelterSystems(state, derived);
  const plan = nightPlan(state);
  const faction = factionConsequences(state);
  const adjustedDefense = Math.max(0, derived.defense + plan.defense + derived.siegeMitigation * 0.6 + systems.coverage * 0.12);
  const adjustedNoise = clamp(state.shelter.noise + plan.noise + (faction.nightNoise || 0), 0, 10);
  const guardBonus = guardStrength(state) * 0.34;
  const signalBonus = state.survivors.assigned.tuner * 0.05;
  const maintenancePenalty = Math.max(0, -systems.maintenanceBalance);
  const dangerScore = clamp(
    state.shelter.threat * 1.5
      + adjustedNoise * 1.28
      + Math.max(0, state.time.day - 1) * 0.38
      + systems.powerGap * 0.52
      + maintenancePenalty * 0.84
      - adjustedDefense * 0.84
      - state.shelter.warmth * 0.24
      - systems.coverage * 0.22
      - guardBonus
      - signalBonus,
    0,
    14,
  );

  const infectedChance = clamp(
    0.16
      + state.shelter.threat * 0.08
      + adjustedNoise * 0.05
      + maintenancePenalty * 0.03
      - adjustedDefense * 0.018
      - systems.coverage * 0.012,
    0.1,
    0.86,
  );
  const raidChance = clamp(
    (state.time.day >= 3 ? 0.1 : 0.03)
      + adjustedNoise * 0.06
      + state.resources.reputation * 0.01
      + systems.powerGap * 0.02
      + plan.raidBias
      + (faction.raidBias || 0)
      - (faction.raidMitigation || 0)
      - systems.coverage * 0.02
      - adjustedDefense * 0.012,
    0.04,
    0.7,
  );
  const breachChance = clamp(
    0.08
      + Math.max(0, dangerScore - 1.5) * 0.06
      + maintenancePenalty * 0.035
      + plan.breachBias
      - (faction.breachMitigation || 0)
      - derived.siegeMitigation * 0.03
      - systems.coverage * 0.014
      - adjustedDefense * 0.015,
    0.03,
    0.64,
  );
  const siegeChance = clamp(
    (state.time.day >= 4 ? 0.06 : 0.01)
      + Math.max(0, dangerScore - 4.2) * 0.05
      + breachChance * 0.32
      + raidChance * 0.14
      - adjustedDefense * 0.012
      - derived.siegeMitigation * 0.03,
    0.01,
    0.56,
  );
  const quietChance = clamp(1 - (infectedChance * 0.46 + raidChance * 0.36 + breachChance * 0.32 + siegeChance * 0.28), 0.04, 0.58);
  const hoursUntilNight = state.time.hour < 21 ? 21 - state.time.hour : 24 - state.time.hour + 21;

  let severity = "Quiet";
  if (dangerScore >= 2.5) {
    severity = "Tense";
  }
  if (dangerScore >= 4.8) {
    severity = "Rough";
  }
  if (dangerScore >= 7) {
    severity = "Critical";
  }
  if (siegeChance >= 0.28 || dangerScore >= 8.2) {
    severity = "Siege";
  }

  return {
    plan,
    systems,
    adjustedDefense,
    adjustedNoise,
    dangerScore,
    infectedChance,
    raidChance,
    breachChance,
    siegeChance,
    quietChance,
    hoursUntilNight,
    severity,
  };
}

function setNightPlan(state, planId) {
  if (!NIGHT_PLANS[planId] || state.night.plan === planId) {
    return false;
  }

  state.night.plan = planId;
  addLog(state, `Night stance set: ${NIGHT_PLANS[planId].label}.`, "night");
  return true;
}

function expeditionApproach(approachId) {
  return EXPEDITION_APPROACHES_BY_ID[approachId] || EXPEDITION_APPROACHES_BY_ID.standard;
}

function expeditionObjective(objectiveId) {
  return EXPEDITION_OBJECTIVES_BY_ID[objectiveId] || EXPEDITION_OBJECTIVES_BY_ID.salvage;
}

function radioInvestigation(investigationId) {
  return RADIO_INVESTIGATIONS_BY_ID[investigationId] || RADIO_INVESTIGATIONS_BY_ID.civic_band;
}

function alignedFaction(state) {
  return null;
}

function factionConsequences(state) {
  return alignedFaction(state)?.consequences || {};
}

function channelAvailable(state, channel) {
  if (!channel || !state.unlockedSections.includes("trader")) {
    return false;
  }
  if (channel.requiresFaction && state.faction.aligned !== channel.requiresFaction) {
    return false;
  }
  return true;
}

function getAvailableTraderChannels(state) {
  return TRADER_CHANNELS.filter((channel) => channelAvailable(state, channel));
}

function prepareExpedition(state, zoneId) {
  if (!ZONES_BY_ID[zoneId] || !state.unlockedZones.includes(zoneId)) {
    return false;
  }

  state.expedition.selectedZone = zoneId;
  if (!EXPEDITION_APPROACHES_BY_ID[state.expedition.approach]) {
    state.expedition.approach = "standard";
  }
  if (!EXPEDITION_OBJECTIVES_BY_ID[state.expedition.objective]) {
    state.expedition.objective = "salvage";
  }
  addLog(state, `Route board updated for ${ZONES_BY_ID[zoneId].name}.`, "expedition");
  return true;
}

function setExpeditionApproach(state, approachId) {
  if (!EXPEDITION_APPROACHES_BY_ID[approachId] || state.expedition.approach === approachId) {
    return false;
  }

  state.expedition.approach = approachId;
  addLog(state, `Expedition approach set: ${EXPEDITION_APPROACHES_BY_ID[approachId].label}.`, "expedition");
  return true;
}

function setExpeditionObjective(state, objectiveId) {
  if (!EXPEDITION_OBJECTIVES_BY_ID[objectiveId] || state.expedition.objective === objectiveId) {
    return false;
  }

  state.expedition.objective = objectiveId;
  addLog(state, `Expedition objective set: ${EXPEDITION_OBJECTIVES_BY_ID[objectiveId].label}.`, "expedition");
  return true;
}

function getExpeditionPreview(
  state,
  zoneId = state.expedition.selectedZone,
  approachId = state.expedition.approach,
  objectiveId = state.expedition.objective,
) {
  const zone = ZONES_BY_ID[zoneId];
  const approach = expeditionApproach(approachId);
  const objective = expeditionObjective(objectiveId);
  const derived = getDerivedState(state);
  const faction = factionConsequences(state);

  if (!zone) {
    return null;
  }

  const hours = Math.max(1, zone.hours + approach.hours + objective.hours);
  const encounterChance = clamp(
    zone.encounterChance
      + approach.encounterDelta
      + objective.encounterDelta
      + derived.expeditionEncounterAdjust
      - derived.scoutBonus,
    0.08,
    0.92,
  );
  const lootBonus = derived.expeditionLootBonus + approach.lootBonus + (faction.objectiveBias?.[objective.id] || 0);
  const threat = clamp(0.7 + zone.risk * 0.25 + approach.threat + objective.threat, 0.2, 2.4);
  const noise = approach.noise + zone.risk * 0.12 + objective.noise + (faction.nightNoise || 0) * 0.12;
  const combinedCost = { ...approach.cost };
  Object.entries(objective.cost || {}).forEach(([resourceId, amount]) => {
    combinedCost[resourceId] = (combinedCost[resourceId] || 0) + amount;
  });

  return {
    zone,
    approach,
    objective,
    hours,
    encounterChance,
    lootBonus,
    threat,
    noise,
    cost: combinedCost,
    canLaunch: canAfford(state, combinedCost),
  };
}

function routeEventAvailable(state, event, preview) {
  if (event.approaches && !event.approaches.includes(preview.approach.id)) {
    return false;
  }
  if (event.objectives && !event.objectives.includes(preview.objective.id)) {
    return false;
  }
  if (event.zones && !event.zones.includes(preview.zone.id)) {
    return false;
  }
  if (event.day && state.time.day < event.day) {
    return false;
  }
  if (event.items && !event.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  return true;
}

function pickRouteEvent(state, preview) {
  const candidates = EXPEDITION_ROUTE_EVENTS.filter((event) => routeEventAvailable(state, event, preview));
  if (!candidates.length) {
    return null;
  }

  const totalWeight = candidates.reduce((sum, event) => sum + (event.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of candidates) {
    roll -= event.weight || 1;
    if (roll <= 0) {
      return event;
    }
  }
  return candidates[candidates.length - 1];
}

function applyRouteEvent(state, preview) {
  if (!chance(0.72)) {
    state.expedition.lastRouteEvent = null;
    return { preview, event: null };
  }

  const event = pickRouteEvent(state, preview);
  if (!event) {
    state.expedition.lastRouteEvent = null;
    return { preview, event: null };
  }

  const adjusted = {
    ...preview,
    hours: Math.max(1, preview.hours + (event.timeDelta || 0)),
    encounterChance: clamp(preview.encounterChance + (event.encounterDelta || 0), 0.08, 0.96),
    lootBonus: preview.lootBonus + (event.lootBonus || 0),
    threat: clamp(preview.threat + (event.threatDelta || 0), 0.15, 3.2),
    noise: clamp(preview.noise + (event.noiseDelta || 0), 0, 3.4),
    cost: { ...preview.cost },
  };

  if (event.resources) {
    Object.entries(event.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  }
  if (event.radioTrace) {
    Object.entries(event.radioTrace).forEach(([traceId, amount]) => {
      state.radio.traces[traceId] = Number(((state.radio.traces[traceId] || 0) + amount).toFixed(2));
      resolveRadioMilestones(state, traceId);
    });
  }
  if (event.condition) {
    state.condition = clamp(state.condition + event.condition, 0, getDerivedState(state).maxCondition);
  }
  if (event.secretProgress) {
    state.story.secretProgress += event.secretProgress;
  }
  if (event.morale) {
    addResource(state, "morale", event.morale);
  }
  if (event.stress) {
    const stressed = applySurvivorStress(state, event.stress, ["scout", "scavenger", "tuner"]);
    if (stressed) {
      addLog(state, `${stressed.name} carries the route strain back into the shelter.`, "crew");
    }
  }

  state.expedition.lastRouteEvent = {
    id: event.id,
    label: event.label,
    text: event.text,
    stamp: getTimeStamp(state),
    zoneId: preview.zone.id,
  };
  addLog(state, event.text, "expedition");
  return { preview: adjusted, event };
}

function launchPreparedExpedition(state) {
  if (!state.expedition.selectedZone) {
    return false;
  }
  return scavengeZone(state, state.expedition.selectedZone, state.expedition.approach);
}

function canAfford(state, cost = {}) {
  return Object.entries(cost).every(([resourceId, amount]) => state.resources[resourceId] >= amount);
}

function hasMaterials(state, materials = {}) {
  return Object.entries(materials).every(([itemId, amount]) => (state.inventory[itemId] || 0) >= amount);
}

function spendResources(state, cost = {}) {
  Object.entries(cost).forEach(([resourceId, amount]) => {
    state.resources[resourceId] = Math.max(0, state.resources[resourceId] - amount);
  });
}

function spendMaterials(state, materials = {}) {
  Object.entries(materials).forEach(([itemId, amount]) => {
    state.inventory[itemId] = Math.max(0, (state.inventory[itemId] || 0) - amount);
    if (state.inventory[itemId] <= 0) {
      delete state.inventory[itemId];
    }
  });
}

function addResource(state, resourceId, amount) {
  if (!RESOURCE_DEFS[resourceId] || !amount) {
    return;
  }

  state.resources[resourceId] = Math.max(0, state.resources[resourceId] + amount);
  if (state.resources[resourceId] > 0) {
    discoverResource(state, resourceId);
  }
}

function grantItem(state, itemId, amount = 1) {
  state.inventory[itemId] = (state.inventory[itemId] || 0) + amount;
  const item = ITEMS[itemId];
  if (!item) {
    return;
  }

  if (item.type === "material" && !state.unlockedSections.includes("inventory")) {
    unlockSection(state, "inventory", "You recover usable material, not just junk. A real inventory starts to matter.");
  }

  if (item.type === "weapon" && !state.equipped.weapon) {
    state.equipped.weapon = itemId;
  }

  if (item.type === "armor" && !state.equipped.armor) {
    state.equipped.armor = itemId;
  }
}

function pickWeightedEntry(entries) {
  const totalWeight = entries.reduce((sum, entry) => sum + (entry.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const entry of entries) {
    roll -= entry.weight || 1;
    if (roll <= 0) {
      return entry;
    }
  }
  return entries[entries.length - 1] || null;
}

function createLootBundle() {
  return {
    resources: {},
    items: {},
    finds: [],
  };
}

function addLootFind(bundle, entry, amount) {
  if (!amount) {
    return;
  }

  if (entry.type === "resource") {
    bundle.resources[entry.key] = (bundle.resources[entry.key] || 0) + amount;
    bundle.finds.push({
      rarity: entry.rarity,
      label: RESOURCE_DEFS[entry.key]?.label || entry.key,
      amount,
    });
    return;
  }

  bundle.items[entry.key] = (bundle.items[entry.key] || 0) + amount;
  bundle.finds.push({
    rarity: entry.rarity,
    label: ITEMS[entry.key]?.name || entry.key,
    amount,
  });
}

function addDirectResourceFind(bundle, resourceId, amount) {
  if (!amount) {
    return;
  }

  bundle.resources[resourceId] = (bundle.resources[resourceId] || 0) + amount;
  bundle.finds.push({
    rarity: "lane",
    label: RESOURCE_DEFS[resourceId]?.label || resourceId,
    amount,
  });
}

function applyLootBundle(state, bundle) {
  Object.entries(bundle.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  Object.entries(bundle.items).forEach(([itemId, amount]) => grantItem(state, itemId, amount));
}

function rarityRank(rarityId) {
  return Math.max(0, RARITY_ORDER.indexOf(rarityId));
}

function maybeRecordNotableFind(state, source, finds = []) {
  const notable = finds
    .filter((find) => RARITY_ORDER.includes(find.rarity))
    .sort((left, right) => rarityRank(right.rarity) - rarityRank(left.rarity))[0];

  if (!notable || rarityRank(notable.rarity) < rarityRank("epic")) {
    return;
  }

  state.ui.notableFind = {
    sourceId: source.id,
    sourceLabel: source.label,
    label: notable.label,
    amount: notable.amount,
    rarity: notable.rarity,
    stamp: getTimeStamp(state),
  };
  addLog(state, `Notable find: ${(notable.rarity && notable.rarity[0].toUpperCase() + notable.rarity.slice(1)) || "Rare"} ${notable.label}. ${source.label} just paid out hard.`, "notable");
}

function formatLootFinds(finds = []) {
  return finds
    .map((find) => `${find.rarity === "lane" ? "" : `${find.rarity} `}${find.label} +${find.amount}`.trim())
    .join(", ");
}

function lootMatchesSource(entry, sourceId) {
  return !entry.sources || entry.sources.includes(sourceId);
}

function rollLootTable(table, rarity, state, sourceId = null) {
  const entries = table.filter((entry) => (
    entry.rarity === rarity
    && requirementsMet(state, entry.requires)
    && (!sourceId || lootMatchesSource(entry, sourceId))
  ));
  if (!entries.length) {
    return null;
  }
  return pickWeightedEntry(entries);
}

function pickBonusRarity(source, state, derived) {
  const roll = Math.random();
  const bias = source?.rarityBias || {};

  if (state.flags.worldReveal && roll < 0.02 + (bias.mythic || 0) + derived.rareLootBonus * 0.05) {
    return "mythic";
  }
  if (state.story.radioProgress >= 4 && roll < 0.06 + (bias.anomalous || 0) + derived.rareLootBonus * 0.08) {
    return "anomalous";
  }
  if ((state.story.radioProgress >= 2 || state.stats.searches >= 18) && roll < 0.14 + (bias.legendary || 0) + derived.rareLootBonus * 0.12) {
    return "legendary";
  }
  if ((state.stats.searches >= 10 || hasUpgrade(state, "crafting_bench")) && roll < 0.28 + (bias.epic || 0) + derived.rareLootBonus * 0.18) {
    return "epic";
  }
  if (roll < 0.52 + (bias.rare || 0) + derived.rareLootBonus * 0.3) {
    return "rare";
  }
  return "uncommon";
}

function applySourceDirectResources(bundle, source) {
  Object.entries(source.directResources || {}).forEach(([resourceId, range]) => {
    const amount = randInt(range[0], range[1]);
    addDirectResourceFind(bundle, resourceId, amount);
  });
}

function rollSourceRarities(source, state, derived, bundle) {
  (source.guaranteed || []).forEach((rarity) => {
    const entry = rollLootTable(SEARCH_LOOT_TABLE, rarity, state, source.id);
    if (entry) {
      addLootFind(bundle, entry, randInt(entry.amount[0], entry.amount[1]));
    }
  });

  (source.rolls || []).forEach((roll) => {
    if (!requirementsMet(state, roll.requires)) {
      return;
    }

    if (!chance(roll.chance + derived.rareLootBonus * (roll.rareBonus || 0))) {
      return;
    }

    const entry = rollLootTable(SEARCH_LOOT_TABLE, roll.rarity, state, source.id);
    if (entry) {
      addLootFind(bundle, entry, randInt(entry.amount[0], entry.amount[1]));
    }
  });
}

function applyEffectBundle(state, effects = {}) {
  if (effects.resources) {
    Object.entries(effects.resources).forEach(([resourceId, amount]) => {
      addResource(state, resourceId, amount);
    });
  }

  if (effects.condition) {
    const maxCondition = getDerivedState(state).maxCondition;
    state.condition = clamp(state.condition + effects.condition, 0, maxCondition);
  }

  if (effects.grantItems) {
    Object.entries(effects.grantItems).forEach(([itemId, amount]) => {
      grantItem(state, itemId, amount);
    });
  }

  if (effects.discoverResources) {
    effects.discoverResources.forEach((resourceId) => discoverResource(state, resourceId));
  }

  if (effects.unlockSections) {
    effects.unlockSections.forEach((sectionId) => unlockSection(state, sectionId));
  }

  if (effects.unlockZones) {
    effects.unlockZones.forEach((zoneId) => unlockZone(state, zoneId));
  }

  if (effects.setFlags) {
    Object.assign(state.flags, effects.setFlags);
  }

  if (effects.radioProgress) {
    state.story.radioProgress += effects.radioProgress;
  }

  if (effects.secretProgress) {
    state.story.secretProgress += effects.secretProgress;
  }

  if (effects.radioTrace) {
    Object.entries(effects.radioTrace).forEach(([traceId, amount]) => {
      if (state.radio.traces[traceId] === undefined) {
        state.radio.traces[traceId] = 0;
      }
      state.radio.traces[traceId] += amount;
    });
  }
}

function eventAvailable(state, event, pool) {
  if (event.pool !== pool) {
    return false;
  }
  if (event.once && state.seenEvents.includes(event.id)) {
    return false;
  }
  return requirementsMet(state, event.requires);
}

function pickWeightedEvent(state, pool) {
  const candidates = EVENTS.filter((event) => eventAvailable(state, event, pool));
  if (!candidates.length) {
    return null;
  }

  const totalWeight = candidates.reduce((sum, event) => sum + (event.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of candidates) {
    roll -= event.weight || 1;
    if (roll <= 0) {
      return event;
    }
  }
  return candidates[candidates.length - 1];
}

function runEvent(state, pool) {
  const event = pickWeightedEvent(state, pool);
  if (!event) {
    return null;
  }

  markEventSeen(state, event.id);
  applyEffectBundle(state, event.effects);
  const category = event.category
    || (pool.startsWith("travel") ? "expedition"
      : pool.startsWith("zone:") ? "expedition"
        : pool === "radio" || pool.startsWith("radio:") ? "radio"
          : pool === "night" ? "night"
            : pool === "food" ? "loot"
              : pool === "search" ? "loot"
                : "general");
  addLog(state, event.text, category);
  return event;
}

function formatCost(cost = {}) {
  return Object.entries(cost)
    .map(([resourceId, amount]) => `${RESOURCE_DEFS[resourceId].label} ${amount}`)
    .join(" / ");
}

function formatMaterials(materials = {}) {
  return Object.entries(materials)
    .map(([itemId, amount]) => `${ITEMS[itemId]?.name || itemId} ${amount}`)
    .join(" / ");
}

function getVisibleUpgrades(state) {
  return UPGRADES.filter((upgrade) => state.upgrades.includes(upgrade.id) || requirementsMet(state, upgrade.requires));
}

function getAvailableUpgrades(state) {
  return UPGRADES.filter((upgrade) => !state.upgrades.includes(upgrade.id) && requirementsMet(state, upgrade.requires));
}

function evaluateProgression(state) {
  syncSurvivorRoster(state);
  if (state.stats.searches >= 3 && !state.flags.burnUnlocked) {
    state.flags.burnUnlocked = true;
    addLog(state, "Cold makes simple math persuasive. Twelve scrap for warmth suddenly sounds fair.");
  }

  if ((state.stats.searches >= 4 || state.resources.scrap >= 8) && !state.unlockedSections.includes("upgrades")) {
    unlockSection(state, "upgrades", "Plans start replacing panic. You can build.");
  }

  if (hasUpgrade(state, "shelter_stash") || hasUpgrade(state, "campfire") || hasUpgrade(state, "basic_barricade")) {
    unlockSection(state, "shelter");
  }

  if (hasUpgrade(state, "rusty_knife") || hasUpgrade(state, "weapon_rack") || hasUpgrade(state, "armor_hooks")) {
    unlockSection(state, "inventory");
  }

  if (hasUpgrade(state, "small_scavenge") || hasUpgrade(state, "map_board")) {
    unlockSection(state, "map");
  }

  if (hasUpgrade(state, "survivor_cots")) {
    unlockSection(state, "survivors");
    discoverResource(state, "morale");
  }

  if (hasUpgrade(state, "radio_rig")) {
    unlockSection(state, "radio");
    discoverResource(state, "reputation");
  }

  if (state.story.secretProgress >= 2 && hasItem(state, "relay_key") && !state.flags.bunkerRouteKnown) {
    state.flags.bunkerRouteKnown = true;
    unlockZone(state, "hidden_bunker_entrance", "A pattern in the static and a key in your hand point to a bunker route under the city.");
  }

  RESOURCE_ORDER.forEach((resourceId) => {
    if (state.resources[resourceId] > 0) {
      discoverResource(state, resourceId);
    }
  });
}

function markZoneVisited(state, zoneId) {
  if (!state.visitedZones.includes(zoneId)) {
    state.visitedZones.push(zoneId);
    state.stats.zonesVisited = state.visitedZones.length;
  }
}

function zoneRewardMultiplier(baseAmount, bonus) {
  return Math.max(0, Math.round(baseAmount * (1 + bonus)));
}

function objectiveBiasForResource(objective, resourceId) {
  return objective?.resourceBias?.[resourceId] || 0;
}

function generateZoneRewards(zone, derived, lootBonus = 0, objective = EXPEDITION_OBJECTIVES_BY_ID.salvage) {
  const rewards = {
    resources: {},
    grantItems: {},
  };

  Object.entries(zone.loot).forEach(([resourceId, range]) => {
    const amount = randInt(range[0], range[1]);
    rewards.resources[resourceId] = zoneRewardMultiplier(
      amount,
      derived.expeditionLootBonus + lootBonus + objectiveBiasForResource(objective, resourceId),
    );
  });

  if (chance(zone.itemChance + (objective.itemChanceBonus || 0) + derived.scoutBonus * 0.2 + Math.max(0, lootBonus) * 0.16)) {
    const itemId = pickOne(zone.itemPool);
    if (itemId) {
      rewards.grantItems[itemId] = 1;
    }
  }

  if (objective.traceGain) {
    rewards.radioTrace = { ...objective.traceGain };
  }

  return rewards;
}

function applyZoneRewards(state, zoneId, rewards) {
  applyEffectBundle(state, rewards);
  const zone = ZONES_BY_ID[zoneId];
  const gains = Object.entries(rewards.resources)
    .filter(([, amount]) => amount > 0)
    .map(([resourceId, amount]) => `${RESOURCE_DEFS[resourceId].label} +${amount}`);
  const items = Object.keys(rewards.grantItems || {}).map((itemId) => ITEMS[itemId].name);
  const fragments = [];

  if (gains.length) {
    fragments.push(gains.join(", "));
  }
  if (items.length) {
    fragments.push(`found ${items.join(", ")}`);
  }
  if (rewards.radioTrace) {
    fragments.push(`traces ${Object.keys(rewards.radioTrace).join(", ")}`);
  }

  addLog(state, `You return from ${zone.name} with ${fragments.join(" and ")}.`, "expedition");
}

function sourceEncounterProfile(sourceId) {
  switch (sourceId) {
    case "vehicle_shells":
      return { zoneId: "abandoned_gas_station", enemies: ["walker", "stalker"], rewards: { resources: { parts: 1 } } };
    case "dead_pantries":
      return { zoneId: "burned_apartments", enemies: ["walker"], rewards: { resources: { food: 1 } } };
    case "clinic_drawers":
      return { zoneId: "hospital_wing", enemies: ["walker", "screecher"], rewards: { resources: { medicine: 1 } } };
    case "signal_wrecks":
      return { zoneId: "radio_tower_perimeter", enemies: ["stalker", "static_touched"], rewards: { resources: { wire: 1 } } };
    case "sealed_caches":
      return { zoneId: "radio_tower_perimeter", enemies: ["stalker", "relay_brute"], rewards: { resources: { ammo: 1, parts: 1 } } };
    case "rubble":
    default:
      return { zoneId: "ruined_street", enemies: ["walker", "screecher"], rewards: { resources: { wood: 1 } } };
  }
}

function sourceEncounterChance(state, source) {
  const searchPressure = Math.max(0, state.stats.searches - 2) * 0.022;
  const shelterPressure = state.shelter.threat * 0.03 + state.shelter.noise * 0.024;
  const lanePressure = (source.threat || 0.3) * 0.12 + (source.noise || 0.3) * 0.08;

  return clamp(
    0.015 + searchPressure + shelterPressure + lanePressure,
    0.05,
    source.id === "rubble" ? 0.24 : 0.38,
  );
}

function maybeUseFood(state) {
  const derived = getDerivedState(state);
  const upkeep = getShelterUpkeep(state);
  const available = state.resources.food;
  const spent = Math.min(available, upkeep.mealCost);

  if (spent > 0) {
    state.resources.food -= spent;
  }

  if (spent >= upkeep.mealCost) {
    state.condition = clamp(state.condition + 1 + Math.floor(derived.foodSecurity * 0.5), 0, derived.maxCondition);
  } else {
    const shortage = upkeep.mealCost - spent;
    state.condition = clamp(state.condition - Math.max(3, 8 + shortage * 2 - Math.floor(derived.foodSecurity)), 0, derived.maxCondition);
    state.resources.morale = Math.max(0, state.resources.morale - (2 + shortage));
    addLog(state, `The shelter needs ${upkeep.mealCost} food and only finds ${spent}. Hunger turns sharp fast.`, "night");
  }
}

function maybeUseWater(state) {
  const derived = getDerivedState(state);
  const upkeep = getShelterUpkeep(state);
  const available = state.resources.water;
  const spent = Math.min(available, upkeep.waterCost);

  if (spent > 0) {
    state.resources.water -= spent;
  }

  if (spent >= upkeep.waterCost) {
    state.condition = clamp(state.condition, 0, derived.maxCondition);
  } else {
    const shortage = upkeep.waterCost - spent;
    state.condition = clamp(state.condition - Math.max(2, 6 + shortage * 2 - Math.floor(derived.waterSecurity)), 0, derived.maxCondition);
    state.resources.morale = Math.max(0, state.resources.morale - (1 + shortage));
    addLog(state, `The shelter needs ${upkeep.waterCost} drinkable water and comes up short. The room dries out with you in it.`, "night");
  }
}

function maybeUseMaintenance(state) {
  const upkeep = getShelterUpkeep(state);
  if (upkeep.maintenanceWood <= 0 && upkeep.maintenanceParts <= 0) {
    return;
  }

  const spentWood = Math.min(state.resources.wood, upkeep.maintenanceWood);
  const spentParts = Math.min(state.resources.parts, upkeep.maintenanceParts);
  state.resources.wood -= spentWood;
  state.resources.parts -= spentParts;

  if (spentWood >= upkeep.maintenanceWood && spentParts >= upkeep.maintenanceParts) {
    addLog(state, `The shelter burns through ${upkeep.maintenanceWood} wood${upkeep.maintenanceParts ? ` and ${upkeep.maintenanceParts} parts` : ""} to keep the line serviceable.`, "build");
    return;
  }

  const target = pickDamageTarget(state, ["basic_barricade", "watch_post", "repair_rig", "flood_lights", "shelter_core"]);
  addStructureDamage(state, target, 1);
  state.shelter.threat = clamp(state.shelter.threat + 0.35, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + 0.12, 0, 10);
  addLog(
    state,
    `Maintenance slips. ${damageLabel(target)} takes the strain after the shelter only finds ${spentWood}/${upkeep.maintenanceWood} wood${upkeep.maintenanceParts ? ` and ${spentParts}/${upkeep.maintenanceParts} parts` : ""}.`,
    "build",
  );
}

function runNightPressure(state, derived) {
  const forecast = getNightForecast(state);
  const plan = forecast.plan;
  const systems = forecast.systems;
  const roll = Math.random();
  const siegeRoll = forecast.siegeChance;
  const raidRoll = forecast.raidChance;
  const breachRoll = forecast.breachChance;
  const infectedRoll = forecast.infectedChance;
  let eventType = "quiet";

  if (roll < siegeRoll) {
    eventType = "siege";
  } else if (roll < siegeRoll + breachRoll) {
    eventType = "breach";
  } else if (roll < siegeRoll + breachRoll + raidRoll) {
    eventType = "raiders";
  } else if (roll < siegeRoll + breachRoll + raidRoll + infectedRoll) {
    eventType = "infected";
  }

  const basePressure = Math.max(
    0,
    Math.round(
      forecast.dangerScore
      + randInt(0, 2)
      + Math.max(0, -systems.maintenanceBalance)
      + systems.powerGap * 0.7
      - forecast.adjustedDefense * 0.28,
    ),
  );
  const damagedStructures = [];
  let conditionLoss = 0;
  let moraleDelta = plan.morale;
  let stolen = {};
  const crewHits = [];
  let summary = "The line holds through a mostly quiet night.";

  if (eventType === "quiet") {
    const relief = forecast.dangerScore <= 1.5 ? 1 : 0;
    addResource(state, "morale", Math.max(1, 1 + Math.max(0, plan.morale)));
    if (relief > 0) {
      state.condition = clamp(state.condition + relief, 0, derived.maxCondition);
    }
    summary = "The night stays tense. Nothing gets through, but nobody sleeps well.";
  }

  if (eventType === "infected") {
    conditionLoss = Math.max(3, Math.round(basePressure * 0.95));
    moraleDelta -= 2;
    const target = pickDamageTarget(state, ["basic_barricade", "watch_post"]);
    addStructureDamage(state, target, 2);
    damagedStructures.push(target);
    const stressed = applySurvivorStress(state, 1, ["guard", "scavenger"]);
    if (stressed) {
      crewHits.push(`${stressed.name} is rattled by the wall pressure.`);
    }
    summary = "Infected pressure drags along the walls and finds weak points before dawn.";
  }

  if (eventType === "raiders") {
    conditionLoss = Math.max(4, Math.round(basePressure * 0.9));
    moraleDelta -= 3;
    stolen = {
      scrap: Math.min(state.resources.scrap, randInt(3, 8)),
      parts: Math.min(state.resources.parts, chance(0.65) ? randInt(1, 2) : 0),
      food: Math.min(state.resources.food, chance(0.55) ? randInt(0, 2) : 0),
    };
    Object.entries(stolen).forEach(([resourceId, amount]) => {
      state.resources[resourceId] -= amount;
    });
    const target = pickDamageTarget(state, ["basic_barricade", "radio_rig", "watch_post"]);
    addStructureDamage(state, target, 2);
    damagedStructures.push(target);
    const wounded = applySurvivorWound(state, 1, ["guard", "scavenger"]);
    if (wounded) {
      crewHits.push(`${wounded.name} takes a hit while driving raiders off the line.`);
    }
    addResource(state, "reputation", 1);
    summary = "Raiders probe the perimeter, steal what they can reach, and vanish before first light.";
  }

  if (eventType === "breach") {
    conditionLoss = Math.max(6, Math.round(basePressure * 1.2));
    moraleDelta -= 4;
    const firstTarget = pickDamageTarget(state, ["basic_barricade", "shelter_core"]);
    const secondTarget = pickDamageTarget(state, ["watch_post", "campfire", "radio_rig", "crafting_bench", "shelter_core"]);
    addStructureDamage(state, firstTarget, 2);
    addStructureDamage(state, secondTarget, firstTarget === secondTarget ? 1 : 1);
    damagedStructures.push(firstTarget, secondTarget);
    const wounded = applySurvivorWound(state, 1, ["guard", "medic", "idle"]);
    const stressed = applySurvivorStress(state, 2, ["guard", "idle"]);
    if (wounded) {
      crewHits.push(`${wounded.name} is cut up sealing the breach.`);
    }
    if (stressed) {
      crewHits.push(`${stressed.name} is left shaking after something gets inside the line.`);
    }
    summary = "Something gets into the line. The room survives, but not cleanly.";
  }

  if (eventType === "siege") {
    conditionLoss = Math.max(8, Math.round(basePressure * 1.45));
    moraleDelta -= 5;
    state.night.siegePressure += 1;
    state.night.breachCount += 1;
    stolen = {
      scrap: Math.min(state.resources.scrap, randInt(5, 10)),
      ammo: Math.min(state.resources.ammo, chance(0.6) ? randInt(1, 3) : 0),
      food: Math.min(state.resources.food, chance(0.7) ? randInt(1, 2) : 0),
    };
    Object.entries(stolen).forEach(([resourceId, amount]) => {
      state.resources[resourceId] -= amount;
    });
    ["basic_barricade", "watch_post", "flood_lights", "tripwire_grid", "shelter_core"]
      .forEach((targetId) => {
        if (targetId === "shelter_core" || state.upgrades.includes(targetId)) {
          addStructureDamage(state, targetId, targetId === "shelter_core" ? 1 : 2);
          damagedStructures.push(targetId);
        }
      });
    const wounded = applySurvivorWound(state, 2, ["guard", "medic", "idle"]);
    const stressed = applySurvivorStress(state, 3, ["guard", "scavenger", "idle"]);
    if (wounded) {
      crewHits.push(`${wounded.name} is badly hurt holding the center during the siege.`);
    }
    if (stressed) {
      crewHits.push(`${stressed.name} breaks under the siege noise and needs time to steady.`);
    }
    summary = "The shelter takes a full siege. The line holds because you refuse to let it become a room full of last words.";
  }

  conditionLoss = Math.max(0, conditionLoss - Math.floor(derived.nightMitigation));
  if (systems.maintenanceState === "failing") {
    conditionLoss += 2;
    summary += " The failing base adds its own damage to the night.";
  }
  if (systems.powerState === "dark" && eventType !== "quiet") {
    conditionLoss += 1;
    moraleDelta -= 1;
  }

  if (conditionLoss > 0) {
    state.condition = clamp(state.condition - conditionLoss, 0, derived.maxCondition);
  }
  if (moraleDelta > 0) {
    addResource(state, "morale", moraleDelta);
  } else if (moraleDelta < 0) {
    state.resources.morale = Math.max(0, state.resources.morale + moraleDelta);
  }

  state.shelter.noise = clamp(state.shelter.noise * 0.78, 0, 10);
  state.shelter.threat = clamp(state.shelter.threat + (eventType === "quiet" ? -0.15 : eventType === "siege" ? 1.4 : 0.8), 0, 12);
  state.night.lastReport = {
    stamp: getTimeStamp(state),
    eventType,
    severity: forecast.severity,
    conditionLoss,
    moraleDelta,
    siegePressure: state.night.siegePressure,
    damagedStructures: [...new Set(damagedStructures.filter(Boolean))],
    stolen,
    crewHits,
    summary,
  };

  addLog(state, summary, "night");
  if (state.night.lastReport.damagedStructures.length) {
    addLog(state, `Night damage: ${state.night.lastReport.damagedStructures.map((target) => damageLabel(target)).join(", ")}.`, "night");
  }
  if ((stolen.scrap || 0) + (stolen.parts || 0) + (stolen.food || 0) + (stolen.ammo || 0) > 0) {
    addLog(
      state,
      `Night losses: Scrap ${stolen.scrap || 0}${stolen.parts ? ` / Parts ${stolen.parts}` : ""}${stolen.food ? ` / Food ${stolen.food}` : ""}${stolen.ammo ? ` / Ammo ${stolen.ammo}` : ""}.`,
      "night",
    );
  }
  crewHits.forEach((line) => addLog(state, line, "crew"));
  if (systems.powerState !== "stable") {
    addLog(state, `Power state is ${systems.powerState}. Signal and utility systems are running thinner than the shelter wants.`, "night");
  }

  runEvent(state, "night");
}

function advanceTime(state, hours) {
  for (let index = 0; index < hours; index += 1) {
    const derived = getDerivedState(state);
    state.time.hour += 1;
    if (state.time.hour >= 24) {
      state.time.hour = 0;
      state.time.day += 1;
    }

    state.shelter.warmth = Math.max(0, state.shelter.warmth - 0.4);
    state.shelter.threat = clamp(state.shelter.threat + 0.34, 0, 12);
    state.shelter.noise = clamp(state.shelter.noise - 0.05, 0, 10);
    state.clocks.hunger += 1;
    state.clocks.thirst += 1;
    state.clocks.maintenance += 1;

    if (state.clocks.hunger >= 6) {
      state.clocks.hunger = 0;
      maybeUseFood(state);
    }

    if (state.clocks.thirst >= 4) {
      state.clocks.thirst = 0;
      maybeUseWater(state);
    }

    if (state.clocks.maintenance >= 8) {
      state.clocks.maintenance = 0;
      maybeUseMaintenance(state);
    }

    if (state.time.hour === 21) {
      runNightPressure(state, derived);
    }

    if (state.time.hour === 6 && state.time.day > 1) {
      state.stats.nightsSurvived += 1;
      state.shelter.threat = clamp(state.shelter.threat - derived.defense * 0.22, 0, 12);
      state.shelter.noise = clamp(state.shelter.noise - 0.6, 0, 10);
      recoverSurvivorsAtDawn(state);
      maybeTriggerCrewConflict(state);
      addLog(state, "A grey dawn leaks over the shelter. You are still here.", "night");
    }
  }
}

function runScavengeSource(state, sourceId = "rubble") {
  const source = SCAVENGE_SOURCES_BY_ID[sourceId];
  if (!sourceAvailable(state, source)) {
    return false;
  }

  const derived = getDerivedState(state);
  const traitBonuses = survivorTraitBonuses(state);
  advanceTime(state, source.hours || 1);
  state.stats.searches += 1;
  state.stats.scavengeSources[sourceId] = (state.stats.scavengeSources[sourceId] || 0) + 1;
  state.shelter.threat = clamp(state.shelter.threat + (source.threat || 0.35) + 0.16, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + (source.noise || 0.4) + 0.12 - traitBonuses.scavengeNoiseReduction, 0, 10);

  const scrapMin = Math.max(0, derived.searchScrapMin + (source.scrapMod?.min || 0));
  const scrapMax = Math.max(scrapMin, derived.searchScrapMax + (source.scrapMod?.max || 0));
  const directScrap = Math.max(0, zoneRewardMultiplier(randInt(scrapMin, scrapMax), derived.salvageYieldBonus));
  const lootBundle = createLootBundle();
  addResource(state, "scrap", directScrap);
  applySourceDirectResources(lootBundle, source);
  if (hasItem(state, "salvage_hatchet") && ["rubble", "dead_pantries"].includes(source.id)) {
    addDirectResourceFind(lootBundle, "wood", 1);
  }
  if (hasItem(state, "pry_bar") && ["vehicle_shells", "sealed_caches"].includes(source.id)) {
    addDirectResourceFind(lootBundle, "parts", 1);
  }
  rollSourceRarities(source, state, derived, lootBundle);

  for (let rollIndex = 0; rollIndex < derived.searchBonusRolls; rollIndex += 1) {
    if (!chance(source.bonusChance || 0.6)) {
      continue;
    }
    const bonusRarity = pickBonusRarity(source, state, derived);
    const bonusRoll = rollLootTable(SEARCH_LOOT_TABLE, bonusRarity, state, source.id);
    if (bonusRoll) {
      addLootFind(lootBundle, bonusRoll, randInt(bonusRoll.amount[0], bonusRoll.amount[1]));
    }
  }

  applyLootBundle(state, lootBundle);
  maybeRecordNotableFind(state, source, lootBundle.finds);

  const lootSummary = lootBundle.finds.length
    ? ` ${formatLootFinds(lootBundle.finds)}.`
    : "";
  addLog(state, `You work ${source.logLabel}. scrap +${directScrap}.${lootSummary}`, "loot");
  if (!state.combat && chance(sourceEncounterChance(state, source))) {
    const profile = sourceEncounterProfile(source.id);
    createCombat(state, pickOne(profile.enemies), profile.zoneId, profile.rewards);
  } else if (chance(source.eventChance || 0.42)) {
    runEvent(state, "search");
  }

  evaluateProgression(state);
  return true;
}

function searchRubble(state) {
  return runScavengeSource(state, "rubble");
}

function burnForWarmth(state) {
  const derived = getDerivedState(state);
  if (state.resources.scrap < 12) {
    return false;
  }

  state.resources.scrap -= 12;
  state.stats.burnUses += 1;
  state.shelter.warmth = clamp(state.shelter.warmth + 2.6, 0, 10);
  state.shelter.noise = clamp(state.shelter.noise + 0.25, 0, 10);
  state.condition = clamp(state.condition + derived.burnCondition, 0, derived.maxCondition);
  addLog(state, "You feed the fire with old metal and buy yourself another stretch of feeling alive.", "build");
  evaluateProgression(state);
  return true;
}

function forageFood(state) {
  const derived = getDerivedState(state);
  advanceTime(state, 1);
  state.stats.foodSearches += 1;
  state.shelter.noise = clamp(state.shelter.noise + 0.3, 0, 10);
  state.shelter.threat = clamp(state.shelter.threat + 0.12, 0, 12);
  addResource(state, "food", zoneRewardMultiplier(randInt(1, 2), derived.forageYieldBonus));
  addResource(state, "water", zoneRewardMultiplier(randInt(0, 1), derived.forageYieldBonus));
  if (chance(0.18)) {
    addResource(state, "medicine", 1);
  }
  if (chance(0.12)) {
    addResource(state, "cloth", 1);
  }
  addLog(state, "You search for food instead of useful things. Today, that is the useful thing.", "loot");
  if (chance(0.55)) {
    runEvent(state, "food");
  }
  evaluateProgression(state);
}

function drinkWater(state) {
  if (state.resources.water < 1) {
    return false;
  }

  state.resources.water -= 1;
  state.clocks.thirst = 0;
  state.condition = clamp(state.condition + 4, 0, getDerivedState(state).maxCondition);
  addLog(state, "You drink slowly and let your hands stop shaking.");
  return true;
}

function buyUpgrade(state, upgradeId) {
  const upgrade = UPGRADES_BY_ID[upgradeId];
  if (!upgrade || state.upgrades.includes(upgradeId)) {
    return false;
  }
  if (
    !requirementsMet(state, upgrade.requires)
    || !canAfford(state, upgrade.cost)
    || !hasMaterials(state, upgrade.materials)
  ) {
    return false;
  }

  spendResources(state, upgrade.cost);
  spendMaterials(state, upgrade.materials);
  state.upgrades.push(upgradeId);
  applyEffectBundle(state, upgrade.effects);
  addLog(state, `Built: ${upgrade.name}. ${upgrade.description}`, "build");
  evaluateProgression(state);
  return true;
}

function enemyBehavior(enemyId) {
  return ENEMIES[enemyId]?.behavior || {};
}

function enemyIntent(enemyId, turn = 1) {
  const behavior = enemyBehavior(enemyId);
  if (enemyId === "stalker" && turn === 1) {
    return "ambush";
  }
  if (!behavior.intents?.length) {
    return behavior.defaultIntent || "lunge";
  }
  return behavior.intents[randInt(0, behavior.intents.length - 1)] || behavior.defaultIntent || "lunge";
}

function combatIntentLabel(intent) {
  switch (intent) {
    case "grapple":
      return "grapple";
    case "shriek":
      return "shriek";
    case "rupture":
      return "rupture";
    case "ambush":
      return "ambush";
    case "feint":
      return "feint";
    case "pulse":
      return "static pulse";
    case "crush":
      return "crush";
    case "lunge":
    default:
      return "lunge";
  }
}

function queueNextCombatIntent(state) {
  if (!state.combat) {
    return;
  }
  state.combat.turn += 1;
  state.combat.intent = enemyIntent(state.combat.enemyId, state.combat.turn);
}

function createCombat(state, enemyId, zoneId, rewards, preview = null) {
  state.combat = {
    enemyId,
    zoneId,
    enemyHp: ENEMIES[enemyId].hp,
    rewards,
    objectiveId: preview?.objective?.id || state.expedition.objective || "salvage",
    turn: 1,
    intent: enemyIntent(enemyId, 1),
    brace: 0,
    grappled: false,
  };
  addLog(
    state,
    `${ENEMIES[enemyId].name} closes in near ${ZONES_BY_ID[zoneId].name}. Intent: ${combatIntentLabel(state.combat.intent)}.`,
    "combat",
  );
}

function scavengeZone(state, zoneId, approachId = state.expedition.approach || "standard") {
  const zone = ZONES_BY_ID[zoneId];
  if (!zone || !state.unlockedZones.includes(zoneId) || state.combat) {
    return false;
  }

  const preview = getExpeditionPreview(state, zoneId, approachId, state.expedition.objective);
  if (!preview || !preview.canLaunch) {
    return false;
  }

  const derived = getDerivedState(state);
  const route = applyRouteEvent(state, preview);
  const adjustedPreview = route.preview;
  spendResources(state, adjustedPreview.cost);
  advanceTime(state, adjustedPreview.hours);
  state.stats.expeditions += 1;
  markZoneVisited(state, zoneId);
  state.shelter.threat = clamp(state.shelter.threat + adjustedPreview.threat, 0, 12);
  state.shelter.noise = clamp(state.shelter.noise + adjustedPreview.noise, 0, 10);
  state.expedition.selectedZone = zoneId;
  state.expedition.approach = adjustedPreview.approach.id;
  state.expedition.objective = adjustedPreview.objective.id;
  addLog(
    state,
    `Route set: ${zone.name} via ${adjustedPreview.approach.label.toLowerCase()} approach on ${adjustedPreview.objective.label.toLowerCase()} objective.`,
    "expedition",
  );
  if (chance(adjustedPreview.approach.travelEventChance)) {
    runEvent(state, `travel:${adjustedPreview.approach.id}`);
  }

  const rewards = generateZoneRewards(zone, derived, adjustedPreview.lootBonus, adjustedPreview.objective);
  const encounterChance = adjustedPreview.encounterChance;
  state.expedition.lastOutcome = {
    zoneId,
    objectiveId: adjustedPreview.objective.id,
    approachId: adjustedPreview.approach.id,
    routeEventId: route.event?.id || null,
    encounterChance: Number(encounterChance.toFixed(2)),
    lootBonus: Number(adjustedPreview.lootBonus.toFixed(2)),
    stamp: getTimeStamp(state),
  };
  if (chance(encounterChance)) {
    createCombat(state, pickOne(zone.enemies), zoneId, rewards, adjustedPreview);
  } else {
    applyZoneRewards(state, zoneId, rewards);
    if (adjustedPreview.objective.id === "signal") {
      resolveRadioMilestones(state, "tower_grid");
      resolveRadioMilestones(state, "anomaly_trace");
    }
    runEvent(state, `zone:${zoneId}`);
  }

  evaluateProgression(state);
  return true;
}

function resolveCombatVictory(state) {
  const enemy = ENEMIES[state.combat.enemyId];
  const zoneId = state.combat.zoneId;
  const behavior = enemyBehavior(enemy.id);
  const derived = getDerivedState(state);
  applyEffectBundle(state, { resources: enemy.reward });
  if (behavior.deathBurst) {
    applyEffectBundle(state, { resources: behavior.deathBurst });
    if (behavior.deathSplash) {
      state.condition = clamp(state.condition - behavior.deathSplash, 0, derived.maxCondition);
      addLog(state, `${enemy.name} ruptures on the way down.`, "combat");
    }
  }
  if (enemy.id === "static_touched") {
    state.radio.traces.anomaly_trace = Number(((state.radio.traces.anomaly_trace || 0) + 0.5).toFixed(2));
  }
  applyZoneRewards(state, zoneId, state.combat.rewards);
  state.stats.combatsWon += 1;
  addLog(state, `${enemy.name} drops hard. The noise it made keeps moving without it.`, "combat");
  if (state.combat.objectiveId === "signal") {
    resolveRadioMilestones(state, "tower_grid");
    resolveRadioMilestones(state, "anomaly_trace");
  }
  runEvent(state, `zone:${zoneId}`);
  state.combat = null;
  evaluateProgression(state);
}

function resolveCombatLoss(state) {
  const lostScrap = Math.min(state.resources.scrap, randInt(4, 10));
  const lostFood = Math.min(state.resources.food, 1);
  state.resources.scrap -= lostScrap;
  state.resources.food -= lostFood;
  state.resources.morale = Math.max(0, state.resources.morale - 2);
  state.condition = 18;
  const wounded = applySurvivorWound(state, 1, ["scout", "guard", "idle"]);
  const stressed = applySurvivorStress(state, 2, ["scout", "guard", "idle"]);
  addLog(state, `You drag yourself home, leaving Scrap ${lostScrap} and Food ${lostFood} behind with the blood.`, "combat");
  if (wounded) {
    addLog(state, `${wounded.name} comes back from the route hurt and slower than before.`, "crew");
  }
  if (stressed) {
    addLog(state, `${stressed.name} cannot stop replaying the route in their head.`, "crew");
  }
  state.combat = null;
}

function combatPlayerDamage(state, derived, enemy) {
  const weapon = ITEMS[state.equipped.weapon];
  let damage = randInt(derived.attack, derived.attack + 3);

  if (state.combat.objectiveId === "sweep") {
    damage += 1;
  }

  if (weapon?.ammoPerAttack) {
    if (state.resources.ammo >= weapon.ammoPerAttack) {
      state.resources.ammo -= weapon.ammoPerAttack;
      damage += 2;
    } else {
      damage = randInt(1, 3);
      addLog(state, `The ${weapon.name} clicks empty. You attack anyway.`, "combat");
    }
  }

  const armor = enemyBehavior(enemy.id).armor || 0;
  return Math.max(1, damage - armor);
}

function resolveEnemyTurn(state, forcedIntent = null) {
  if (!state.combat) {
    return;
  }

  const derived = getDerivedState(state);
  const enemy = ENEMIES[state.combat.enemyId];
  const behavior = enemyBehavior(enemy.id);
  const intent = forcedIntent || state.combat.intent || behavior.defaultIntent || "lunge";
  let incoming = randInt(enemy.attack[0], enemy.attack[1]);
  let summary = `${enemy.name} presses the fight.`;

  switch (intent) {
    case "grapple":
      incoming = Math.max(1, incoming - 1);
      if (chance(behavior.gripChance || 0.25)) {
        state.combat.grappled = true;
        summary = `${enemy.name} hooks onto you and drags the fight close.`;
      } else {
        summary = `${enemy.name} tries to drag you down but misses the hold.`;
      }
      state.shelter.threat = clamp(state.shelter.threat + (behavior.aftermathThreat || 0.18), 0, 12);
      break;
    case "shriek":
      incoming = Math.max(1, incoming - 1);
      state.shelter.threat = clamp(state.shelter.threat + (behavior.shriekThreat || 0.35), 0, 12);
      state.shelter.noise = clamp(state.shelter.noise + (behavior.shriekNoise || 0.4), 0, 10);
      summary = `${enemy.name} shrieks. Everything outside hears it.`;
      break;
    case "rupture":
      incoming += 1;
      summary = `${enemy.name} swells and forces you back through rotten spray.`;
      break;
    case "ambush":
      incoming += randInt(...(behavior.openerBonus || [1, 3]));
      summary = `${enemy.name} comes in from the angle you weren't watching.`;
      break;
    case "feint":
      incoming = Math.max(1, incoming - 2);
      state.combat.grappled = false;
      summary = `${enemy.name} cuts left, tests you, and waits for the wrong move.`;
      break;
    case "pulse":
      state.resources.morale = Math.max(0, state.resources.morale - (behavior.moraleHit || 1));
      state.radio.traces[state.radio.investigation] = Math.max(0, Number(((state.radio.traces[state.radio.investigation] || 0) - (behavior.signalBurn || 0.25)).toFixed(2)));
      summary = `${enemy.name} throws a static pulse through the fight. The receiver in your head hates it.`;
      break;
    case "crush":
      incoming += 2;
      state.shelter.threat = clamp(state.shelter.threat + 0.25, 0, 12);
      summary = `${enemy.name} commits to a brute crush that rattles your whole line.`;
      break;
    case "lunge":
    default:
      summary = `${enemy.name} lunges.`;
      break;
  }

  let reduced = Math.max(1, incoming - Math.floor(derived.defense * 0.75));
  if (state.combat.brace > 0) {
    reduced = Math.max(1, reduced - state.combat.brace);
    state.combat.brace = 0;
  }
  if (state.combat.grappled && intent !== "grapple") {
    reduced += 1;
  }
  reduced = Math.max(0, reduced - Math.floor(derived.nightMitigation * 0.2));
  state.condition = clamp(state.condition - reduced, 0, derived.maxCondition);
  if (reduced >= 4) {
    const wounded = applySurvivorWound(state, 1, ["scout", "guard", "idle"]);
    if (wounded) {
      addLog(state, `${wounded.name} takes a hard knock in the fight.`, "crew");
    }
  } else if (reduced >= 2) {
    const stressed = applySurvivorStress(state, 1, ["scout", "guard", "idle"]);
    if (stressed && chance(0.4)) {
      addLog(state, `${stressed.name} carries the fight back to the shelter in their nerves.`, "crew");
    }
  }
  addLog(state, `${summary} ${reduced > 0 ? `You lose ${reduced} condition.` : "You hold."}`, "combat");

  if (state.condition <= 0) {
    resolveCombatLoss(state);
    return;
  }

  queueNextCombatIntent(state);
}

function attackCombat(state) {
  if (!state.combat) {
    return false;
  }

  const derived = getDerivedState(state);
  const enemy = ENEMIES[state.combat.enemyId];
  const damage = combatPlayerDamage(state, derived, enemy);

  state.combat.enemyHp = Math.max(0, state.combat.enemyHp - damage);
  if (state.combat.enemyHp <= 0) {
    addLog(state, `You hit ${enemy.name} for ${damage}.`, "combat");
    resolveCombatVictory(state);
    return true;
  }

  addLog(state, `You hit ${enemy.name} for ${damage}. ${enemy.name} lines up ${combatIntentLabel(state.combat.intent)}.`, "combat");
  resolveEnemyTurn(state);
  return true;
}

function braceCombat(state) {
  if (!state.combat) {
    return false;
  }

  state.combat.brace = 3;
  addLog(state, `You brace for ${combatIntentLabel(state.combat.intent)}.`, "combat");
  resolveEnemyTurn(state);
  return true;
}

function retreatCombat(state) {
  if (!state.combat) {
    return false;
  }

  const derived = getDerivedState(state);
  const zoneRisk = ZONES_BY_ID[state.combat.zoneId].risk;
  const behavior = enemyBehavior(state.combat.enemyId);
  const escapeChance = clamp(
    0.45
      + derived.scoutBonus
      - zoneRisk * 0.04
      - (behavior.retreatPenalty || 0)
      - (state.combat.grappled ? behavior.gripPenalty || 0.12 : 0),
    0.15,
    0.8,
  );
  if (chance(escapeChance)) {
    addLog(state, `You break line of sight and lose the ${ENEMIES[state.combat.enemyId].name} in the dark.`, "combat");
    if (state.combat.enemyId === "screecher") {
      state.shelter.threat = clamp(state.shelter.threat + 0.35, 0, 12);
      state.shelter.noise = clamp(state.shelter.noise + 0.5, 0, 10);
    }
    state.combat = null;
    return true;
  }

  addLog(state, `You almost get away. ${ENEMIES[state.combat.enemyId].name} punishes the break.`, "combat");
  resolveEnemyTurn(state, state.combat.intent === "feint" ? "ambush" : state.combat.intent);
  return true;
}

function equipItem(state, itemId) {
  const item = ITEMS[itemId];
  if (!item || !hasItem(state, itemId)) {
    return false;
  }

  if (item.type === "weapon") {
    state.equipped.weapon = itemId;
    addLog(state, `Equipped: ${item.name}.`, "build");
    return true;
  }
  if (item.type === "armor") {
    state.equipped.armor = itemId;
    addLog(state, `Equipped: ${item.name}.`, "build");
    return true;
  }

  return false;
}

function useItem(state, itemId) {
  const item = ITEMS[itemId];
  if (!item || !hasItem(state, itemId) || item.type !== "consumable") {
    return false;
  }

  state.inventory[itemId] -= 1;
  if (state.inventory[itemId] <= 0) {
    delete state.inventory[itemId];
  }

  if (item.heal) {
    state.condition = clamp(state.condition + item.heal, 0, getDerivedState(state).maxCondition);
  }
  if (item.resources) {
    Object.entries(item.resources).forEach(([resourceId, amount]) => addResource(state, resourceId, amount));
  }
  if (item.condition) {
    state.condition = clamp(state.condition + item.condition, 0, getDerivedState(state).maxCondition);
  }

  addLog(state, `Used: ${item.name}.`, "loot");
  evaluateProgression(state);
  return true;
}

function useBestMedicalItem(state) {
  if (hasItem(state, "bandage_roll")) {
    return useItem(state, "bandage_roll");
  }
  if (hasItem(state, "first_aid_rag")) {
    return useItem(state, "first_aid_rag");
  }
  return false;
}

function eatRation(state) {
  if (state.resources.food < 1) {
    return false;
  }

  state.resources.food -= 1;
  state.clocks.hunger = 0;
  state.condition = clamp(state.condition + 6, 0, getDerivedState(state).maxCondition);
  addResource(state, "morale", 1);
  addLog(state, "You eat while the shelter creaks around you.", "loot");
  return true;
}

function patchBarricade(state) {
  if (state.resources.scrap < 6 || state.resources.wood < 2) {
    return false;
  }

  state.resources.scrap -= 6;
  state.resources.wood -= 2;
  state.shelter.threat = clamp(state.shelter.threat - (hasItem(state, "salvage_hatchet") ? 1.9 : 1.5), 0, 12);
  state.shelter.warmth = clamp(state.shelter.warmth + 0.6, 0, 10);
  state.shelter.noise = clamp(state.shelter.noise + 0.18, 0, 10);
  if (hasUpgrade(state, "basic_barricade")) {
    setStructureDamage(state, "basic_barricade", getStructureDamage(state, "basic_barricade") - (hasItem(state, "salvage_hatchet") ? 2 : 1));
  }
  addLog(state, `You patch weak seams with wood, scrap, and stubbornness${hasItem(state, "salvage_hatchet") ? ", using the hatchet to bite the joins clean" : ""}.`, "build");
  return true;
}

function craftAmmo(state) {
  if (
    !hasUpgrade(state, "ammo_press")
    || state.resources.parts < 1
    || state.resources.scrap < 1
    || state.resources.chemicals < 1
  ) {
    return false;
  }

  state.resources.parts -= 1;
  state.resources.scrap -= 1;
  state.resources.chemicals -= 1;
  addResource(state, "ammo", 5);
  addLog(state, "You press a handful of ugly rounds that should still work.", "build");
  return true;
}

function recruitSurvivor(state) {
  const derived = getDerivedState(state);
  if (state.survivors.total >= derived.survivorCap) {
    return false;
  }
  if (!canAfford(state, { scrap: 22, wood: 1, food: 4, water: 2 })) {
    return false;
  }

  spendResources(state, { scrap: 22, wood: 1, food: 4, water: 2 });
  syncSurvivorRoster(state);
  const index = state.survivors.roster.length;
  const traitId = SURVIVOR_TRAIT_IDS[randInt(0, SURVIVOR_TRAIT_IDS.length - 1)];
  state.survivors.roster.push(normalizeSurvivorRecord({
    id: `survivor-${Date.now()}-${index}`,
    name: survivorName(index + randInt(0, SURVIVOR_NAME_POOL.length - 1)),
    traitId,
    role: "idle",
  }, index));
  syncSurvivorRoster(state);
  addResource(state, "morale", 1);
  const recruit = state.survivors.roster[state.survivors.roster.length - 1];
  addLog(state, `${recruit.name} agrees to stay. Trait: ${SURVIVOR_TRAITS[recruit.traitId].label}.`, "crew");
  return true;
}

function adjustSurvivorRole(state, roleId, delta) {
  if (!SURVIVOR_ROLES[roleId]) {
    return false;
  }
  syncSurvivorRoster(state);
  if (delta > 0) {
    const survivor = idleSurvivor(state);
    if (!survivor) {
      return false;
    }
    survivor.role = roleId;
  } else {
    const survivor = assignedSurvivor(state, roleId);
    if (!survivor) {
      return false;
    }
    survivor.role = "idle";
  }
  syncSurvivorRoster(state);
  return true;
}

function getAvailableRadioInvestigations(state) {
  return RADIO_INVESTIGATIONS.filter((investigation) => {
    if (investigation.id === "tower_grid" && !state.unlockedSections.includes("radio")) {
      return false;
    }
    if (investigation.id === "sublevel_echo" && state.story.radioProgress < 1 && !hasItem(state, "relay_key")) {
      return false;
    }
    if (investigation.id === "anomaly_trace" && state.story.radioProgress < 2 && !state.flags.bunkerRouteKnown) {
      return false;
    }
    return true;
  });
}

function setRadioInvestigation(state, investigationId) {
  if (!RADIO_INVESTIGATIONS_BY_ID[investigationId] || state.radio.investigation === investigationId) {
    return false;
  }

  state.radio.investigation = investigationId;
  addLog(state, `Receiver target set: ${RADIO_INVESTIGATIONS_BY_ID[investigationId].label}.`, "radio");
  return true;
}

function radioMilestoneReady(state, investigationId, milestone) {
  if (state.radio.resolved.includes(milestone.id)) {
    return false;
  }
  if ((state.radio.traces[investigationId] || 0) < milestone.at) {
    return false;
  }
  if (milestone.id === "anomaly_dead_static" && !hasItem(state, "bunker_pass")) {
    return false;
  }
  return true;
}

function resolveRadioMilestones(state, investigationId) {
  const investigation = radioInvestigation(investigationId);
  investigation.milestones.forEach((milestone) => {
    if (!radioMilestoneReady(state, investigationId, milestone)) {
      return;
    }

    state.radio.resolved.push(milestone.id);
    applyEffectBundle(state, milestone.effects);
    addLog(state, milestone.text, "radio");
  });

  if (
    investigationId === "anomaly_trace"
    && (state.radio.traces.anomaly_trace || 0) >= 5
    && hasItem(state, "bunker_pass")
    && !state.flags.worldReveal
  ) {
    state.flags.worldReveal = true;
    state.story.radioProgress += 1;
    state.story.secretProgress += 1;
    addLog(state, "The anomaly trace resolves against bunker records. Dead Static was infrastructure wearing the face of an outbreak.", "radio");
  }
}

function getRadioBoard(state) {
  return getAvailableRadioInvestigations(state).map((investigation) => {
    const trace = state.radio.traces[investigation.id] || 0;
    const resolved = investigation.milestones.filter((milestone) => state.radio.resolved.includes(milestone.id));
    const next = investigation.milestones.find((milestone) => !state.radio.resolved.includes(milestone.id)) || null;
    return {
      id: investigation.id,
      label: investigation.label,
      short: investigation.short,
      trace,
      resolvedCount: resolved.length,
      totalMilestones: investigation.milestones.length,
      nextAt: next?.at || null,
      nextText: next?.text || "Track exhausted.",
      active: state.radio.investigation === investigation.id,
    };
  });
}

function scanRadio(state) {
  if (!canAfford(state, { fuel: 1, parts: 1 })) {
    return false;
  }

  const derived = getDerivedState(state);
  const systems = getShelterSystems(state, derived);
  const investigation = radioInvestigation(state.radio.investigation);
  const faction = factionConsequences(state);
  spendResources(state, { fuel: 1, parts: 1 });
  advanceTime(state, 1);
  state.stats.radioScans += 1;
  let traceGain = 1 + derived.signalGain + derived.radioDepth * 0.24 + systems.coverage * 0.06 - systems.powerGap * 0.16;
  if (investigation.id === "anomaly_trace") {
    traceGain += derived.anomalyGain;
    traceGain -= faction.anomalyPenalty || 0;
  }
  if (faction.objectiveBias?.signal && investigation.id === "tower_grid") {
    traceGain += faction.objectiveBias.signal;
  }
  if (systems.maintenanceState === "failing") {
    traceGain -= 0.18;
  }

  state.radio.traces[investigation.id] = Number(((state.radio.traces[investigation.id] || 0) + Math.max(0.5, traceGain)).toFixed(2));
  state.radio.lastSweep = {
    investigationId: investigation.id,
    gain: Number(Math.max(0.5, traceGain).toFixed(2)),
    stamp: getTimeStamp(state),
  };
  addLog(
    state,
    `You work ${investigation.label.toLowerCase()}. ${investigation.traceLabel} +${state.radio.lastSweep.gain}.${systems.powerState !== "stable" ? ` The line is running ${systems.powerState}.` : ""}`,
    "radio",
  );
  runEvent(state, `radio:${investigation.id}`);
  resolveRadioMilestones(state, investigation.id);
  evaluateProgression(state);
  return true;
}

function discountedCost(cost = {}, discount = 0) {
  const adjusted = {};
  Object.entries(cost).forEach(([resourceId, amount]) => {
    adjusted[resourceId] = resourceId === "relics"
      ? amount
      : Math.max(1, Math.round(amount * (1 - discount)));
  });
  return adjusted;
}

function offerAvailable(state, offer, channelId) {
  if (offer.cost.relics && state.story.radioProgress < 2) {
    return false;
  }
  if (offer.id === "rifle_cache" && !state.unlockedSections.includes("trader")) {
    return false;
  }
  if (channelId && offer.channels && !offer.channels.includes(channelId)) {
    return false;
  }
  return true;
}

function requestTraderChannel(state, channelId = state.trader.channel || "open_market") {
  const channel = TRADER_CHANNELS_BY_ID[channelId];
  if (!channelAvailable(state, channel)) {
    return false;
  }

  state.trader.channel = channelId;
  state.trader.offers = TRADER_OFFERS
    .filter((offer) => offerAvailable(state, offer, channelId))
    .map((offer) => offer.id);
  state.trader.lastContact = {
    channelId,
    stamp: getTimeStamp(state),
  };
  state.stats.traderRefreshes += 1;
  addLog(state, `${channel.name} answers. Prices arrive clean and personal.`, "trade");
  return true;
}

function refreshTraderOffers(state) {
  return requestTraderChannel(state, state.trader.channel || "open_market");
}

function getTraderOfferCost(state, offer) {
  return discountedCost(offer.cost, getDerivedState(state).traderDiscount);
}

function buyTraderOffer(state, offerId) {
  const offer = TRADER_OFFERS.find((candidate) => candidate.id === offerId);
  const adjustedCost = discountedCost(offer?.cost || {}, getDerivedState(state).traderDiscount);
  if (!offer || !state.trader.offers.includes(offerId) || !canAfford(state, adjustedCost)) {
    return false;
  }

  spendResources(state, adjustedCost);
  applyEffectBundle(state, offer.reward);
  Object.keys(offer.reward.radioTrace || {}).forEach((traceId) => resolveRadioMilestones(state, traceId));
  state.trader.offers = state.trader.offers.filter((id) => id !== offerId);
  addLog(state, `Trade made: ${offer.name}.`, "trade");
  evaluateProgression(state);
  return true;
}

function chooseFaction(state, factionId) {
  if (state.faction.aligned || !FACTIONS_BY_ID[factionId]) {
    return false;
  }

  state.faction.aligned = factionId;
  addResource(state, "reputation", 4);
  addLog(state, `You align with ${FACTIONS_BY_ID[factionId].name}. The city starts answering differently.`, "radio");
  const channelId = FACTIONS_BY_ID[factionId]?.consequences?.tradeChannel;
  if (channelId) {
    requestTraderChannel(state, channelId);
  }
  return true;
}

function processRealtimeTick(state, seconds = 1) {
  const derived = getDerivedState(state);
  let changed = false;

  RESOURCE_ORDER.forEach((resourceId) => {
    const rate = derived.passive[resourceId];
    if (rate <= 0) {
      return;
    }
    state.buffers.resources[resourceId] += rate * seconds;
    const whole = Math.floor(state.buffers.resources[resourceId]);
    if (whole > 0) {
      state.buffers.resources[resourceId] -= whole;
      addResource(state, resourceId, whole);
      changed = true;
    }
  });

  if (derived.conditionRegen > 0 && state.condition < derived.maxCondition) {
    state.buffers.condition += derived.conditionRegen * seconds;
    const whole = Math.floor(state.buffers.condition);
    if (whole > 0) {
      state.buffers.condition -= whole;
      state.condition = clamp(state.condition + whole, 0, derived.maxCondition);
      changed = true;
    }
  }

  if (changed) {
    evaluateProgression(state);
  }

  return changed;
}


// render/shared.js
const TAB_DEFS = [
  { id: "overview", label: "Overview", hint: "control", count: (state) => state.stats.searches || null },
  { id: "craft", label: "Craft", hint: "build queue", unlock: "upgrades", count: (state) => getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id)).length || null },
  { id: "inventory", label: "Inventory", hint: "gear hold", unlock: "inventory" },
  { id: "shelter", label: "Shelter", hint: "survival", unlock: "shelter" },
  { id: "shelter_map", label: "Shelter Map", hint: "compound", unlock: "shelter" },
  { id: "map", label: "Map", hint: "routes", unlock: "map", count: (state) => state.unlockedZones.length || null },
  { id: "survivors", label: "Crew", hint: "assignments", unlock: "survivors", count: (state) => state.survivors.total || null },
  { id: "radio", label: "Radio", hint: "signals", unlock: "radio", count: (state) => state.story.radioProgress || null },
  { id: "leaderboard", label: "Leaderboard", hint: "hosted" },
  { id: "log", label: "Log", hint: "history" },
  { id: "help", label: "Help", hint: "guide" },
  { id: "settings", label: "Settings", hint: "options" },
];

const MOBILE_PRIMARY_TABS = ["overview", "craft", "shelter", "map"];
const MOBILE_MORE_TABS = ["inventory", "survivors", "radio", "leaderboard", "log", "help", "settings"];

function byId(id) {
  return document.getElementById(id);
}

function isMobileViewport() {
  return typeof window !== "undefined" && Number(window.innerWidth || 0) <= 720;
}

function meterClass(percent) {
  if (percent <= 30) {
    return "danger";
  }
  if (percent <= 60) {
    return "warn";
  }
  return "good";
}

function conditionLabel(percent) {
  if (percent <= 24) {
    return "Critical";
  }
  if (percent <= 49) {
    return "Failing";
  }
  if (percent <= 74) {
    return "Worn";
  }
  return "Stable";
}

function actionButton({ action, label, meta = "", disabled = false, variant = "", data = {} }) {
  const dataAttrs = Object.entries(data)
    .map(([key, value]) => ` data-${key}="${value}"`)
    .join("");
  const classes = ["action-button", variant].filter(Boolean).join(" ");

  return `
    <button
      type="button"
      class="${classes}"
      data-action="${action}"${dataAttrs}
      ${disabled ? "disabled" : ""}
    >
      <span class="action-label">${label}</span>
      ${meta ? `<span class="action-meta">${meta}</span>` : ""}
    </button>
  `;
}

function tagList(values = []) {
  return values.map((value) => `<span class="chip">${value}</span>`).join("");
}

function resourceLabel(resourceId) {
  return RESOURCE_DEFS[resourceId]?.label || resourceId;
}

function itemLabel(itemId) {
  return ITEMS[itemId]?.name || itemId;
}

function contentAvailable(state, requirements = {}) {
  if (requirements.searches && state.stats.searches < requirements.searches) {
    return false;
  }
  if (requirements.burnUses && state.stats.burnUses < requirements.burnUses) {
    return false;
  }
  if (requirements.day && state.time.day < requirements.day) {
    return false;
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    return false;
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    return false;
  }
  if (requirements.survivors && state.survivors.total < requirements.survivors) {
    return false;
  }
  if (requirements.zonesVisited && state.stats.zonesVisited < requirements.zonesVisited) {
    return false;
  }
  if (requirements.reputation && state.resources.reputation < requirements.reputation) {
    return false;
  }
  if (requirements.upgrades && !requirements.upgrades.every((upgradeId) => state.upgrades.includes(upgradeId))) {
    return false;
  }
  if (requirements.items && !requirements.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  if (requirements.flags && !requirements.flags.every((flag) => state.flags[flag])) {
    return false;
  }
  return true;
}

function lootMatchesSource(entry, sourceId) {
  return !sourceId || !entry.sources || entry.sources.includes(sourceId);
}

function sourceVisibleEntries(state, sourceId) {
  return SEARCH_LOOT_TABLE.filter((entry) => lootMatchesSource(entry, sourceId) && contentAvailable(state, entry.requires));
}

function sourceRarityCeiling(state, sourceId) {
  const visibleRarity = [...RARITY_ORDER]
    .reverse()
    .find((rarityId) => sourceVisibleEntries(state, sourceId).some((entry) => entry.rarity === rarityId)) || "common";

  return {
    id: visibleRarity,
    label: RARITY_DEFS[visibleRarity]?.label || visibleRarity,
  };
}

function sourceRunCount(state, sourceId) {
  return state.stats.scavengeSources?.[sourceId] || 0;
}

function describeSourceUnlock(state, source) {
  const requirements = source.requires || {};
  const notes = [];

  if (requirements.searches && state.stats.searches < requirements.searches) {
    notes.push(`${requirements.searches - state.stats.searches} searches`);
  }
  if (requirements.upgrades) {
    const missing = requirements.upgrades
      .filter((upgradeId) => !state.upgrades.includes(upgradeId))
      .map((upgradeId) => UPGRADES_BY_ID[upgradeId]?.name || upgradeId);
    if (missing.length) {
      notes.push(missing.join(" + "));
    }
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    notes.push(`Signal ${requirements.radioProgress}`);
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    notes.push(`Secret ${requirements.secretProgress}`);
  }

  return notes.join(" / ") || "ready";
}

function countMarkup(tab, state) {
  const count = typeof tab.count === "function" ? tab.count(state) : null;
  return count ? `<span class="tab-count">${count}</span>` : "";
}

function getVisibleTabs(state, isMobile = false) {
  return TAB_DEFS
    .filter((tab) => !tab.unlock || state.unlockedSections.includes(tab.unlock))
    .filter((tab) => !isMobile || tab.id !== "shelter_map");
}

function ensureActiveTab(state, isMobile = false) {
  const tabs = getVisibleTabs(state, isMobile);

  if (isMobile && state.ui.activeTab === "shelter_map") {
    state.ui.activeTab = "shelter";
    state.ui.mobileShelterMode = "map";
  }

  if (!tabs.some((tab) => tab.id === state.ui.activeTab)) {
    state.ui.activeTab = tabs[0]?.id || "overview";
  }
  return tabs;
}

function surfaceCard({ title, meta = "", body = "", className = "" }) {
  return `
    <article class="surface-card ${className}">
      <div class="surface-head">
        <h3>${title}</h3>
        ${meta ? `<span class="tag">${meta}</span>` : ""}
      </div>
      <div class="surface-body">${body}</div>
    </article>
  `;
}

function sortedDiscoveredResources(state) {
  return [...state.discoveredResources]
    .filter((resourceId) => RESOURCE_ORDER.includes(resourceId))
    .sort((left, right) => RESOURCE_ORDER.indexOf(left) - RESOURCE_ORDER.indexOf(right));
}

function resourcePillMarkup(state, resourceId, compact = false) {
  return `
    <div class="resource-pill tier-${RESOURCE_DEFS[resourceId].tier} ${compact ? "is-compact" : ""}">
      <div class="resource-pill-key">
        <i class="tier-dot tier-${RESOURCE_DEFS[resourceId].tier}"></i>
        <span>${RESOURCE_DEFS[resourceId].label}</span>
      </div>
      <strong>${state.resources[resourceId]}</strong>
    </div>
  `;
}

function renderResourceBar(state, isMobile = false) {
  const resourceBar = byId("resource-bar");
  const resourceIds = sortedDiscoveredResources(state);
  resourceBar.innerHTML = isMobile ? "" : resourceIds.map((resourceId) => resourcePillMarkup(state, resourceId)).join("");
}

function renderMobileSurvivalStrip(state, derived) {
  const mobileStrip = byId("mobile-survival-strip");
  const resourceIds = sortedDiscoveredResources(state);
  const topResources = resourceIds.slice(0, 4);
  const overflowCount = Math.max(0, resourceIds.length - topResources.length);
  const percent = Math.round((state.condition / derived.maxCondition) * 100);

  mobileStrip.innerHTML = `
    <div class="mobile-survival-head">
      <span class="mobile-condition-label">Condition</span>
      <strong>${state.condition}/${derived.maxCondition}</strong>
    </div>
    <div class="mobile-condition-meter">
      <div class="meter-fill ${meterClass(percent)}" style="width:${percent}%"></div>
    </div>
    <div class="mobile-resource-row">
      ${topResources.map((resourceId) => resourcePillMarkup(state, resourceId, true)).join("")}
      ${overflowCount
        ? `
          <button
            type="button"
            class="resource-pill resource-pill-overflow"
            data-action="toggle-mobile-resource-drawer"
          >
            <span>More</span>
            <strong>+${overflowCount}</strong>
          </button>
        `
        : ""}
    </div>
  `;
}

function renderCondition(state, derived) {
  const percent = Math.round((state.condition / derived.maxCondition) * 100);
  const label = conditionLabel(percent);
  const readout = byId("condition-readout");
  readout.textContent = `Condition ${state.condition}/${derived.maxCondition} - ${label}`;
  readout.title = "Condition is your overall survival state. If it collapses, the run ends. Food, water, warmth, combat, and bad nights all push it.";
  byId("condition-bar").innerHTML = `<div class="meter-fill ${meterClass(percent)}" style="width:${percent}%"></div>`;
}

function renderSummaryStrip(state, derived) {
  const upkeep = getShelterUpkeep(state);
  const systems = getShelterSystems(state, derived);
  const pills = [
    {
      label: "Heat line",
      value: `${state.shelter.warmth.toFixed(1)}/10`,
      note: state.shelter.warmth >= 4 ? "night buffer is holding" : "cold shelter, fix soon",
      tone: state.shelter.warmth >= 4 ? "good" : state.shelter.warmth >= 2 ? "warn" : "danger",
      tip: "Heat line tracks how much warmth the shelter is holding. Low warmth makes every night and cold spell hit harder.",
    },
    {
      label: "Outside threat",
      value: `${state.shelter.threat.toFixed(1)}/12`,
      note: state.shelter.threat < 3 ? "outside pressure is light" : "outside pressure building",
      tone: state.shelter.threat < 3 ? "good" : state.shelter.threat < 6 ? "warn" : "danger",
      tip: "Threat is the outside pressure around the shelter. High threat makes infected, raids, and breaches more likely.",
    },
    {
      label: "Noise trail",
      value: `${state.shelter.noise.toFixed(1)}/10`,
      note: state.shelter.noise < 3 ? "quiet shelter line" : "loud shelters draw heat",
      tone: state.shelter.noise < 3 ? "good" : state.shelter.noise < 6 ? "warn" : "danger",
      tip: "Noise is how loud your shelter and actions are. Loud runs and loud nights attract trouble.",
    },
  ];

  if (state.discoveredResources.includes("food")) {
    pills.push({
      label: "Meal due",
      value: `${upkeep.mealHoursLeft}h / ${upkeep.mealCost}`,
      note: upkeep.mealHoursLeft <= 1 ? "stores need food now" : "next shelter meal",
      tone: upkeep.mealHoursLeft <= 1 ? "danger" : upkeep.mealHoursLeft <= 2 ? "warn" : "neutral",
      tip: `Every ${upkeep.mealHours}h the shelter consumes ${upkeep.mealCost} food. More crew means a larger meal bill.`,
    });
  }
  if (state.discoveredResources.includes("water")) {
    pills.push({
      label: "Water due",
      value: `${upkeep.waterHoursLeft}h / ${upkeep.waterCost}`,
      note: upkeep.waterHoursLeft <= 1 ? "refill drinkable water" : "next shelter drink",
      tone: upkeep.waterHoursLeft <= 1 ? "danger" : upkeep.waterHoursLeft <= 2 ? "warn" : "neutral",
      tip: `Every ${upkeep.waterHours}h the shelter consumes ${upkeep.waterCost} drinkable water. Crew makes this rise fast.`,
    });
  }
  if (state.unlockedSections.includes("survivors")) {
    const freeBeds = Math.max(0, derived.survivorCap - state.survivors.total);
    pills.push({
      label: "Crew",
      value: `${state.survivors.total}/${derived.survivorCap}`,
      note: state.survivors.total > 0
        ? `${upkeep.mealCost} food + ${upkeep.waterCost} water per cycle`
        : freeBeds > 0 ? `${freeBeds} berth open` : "full shelter line",
      tone: freeBeds > 0 ? "neutral" : "warn",
      tip: "Crew capacity controls how many survivors can stay. More hands help, but they also increase upkeep pressure.",
    });
  }
  if (state.unlockedSections.includes("radio")) {
    pills.push({
      label: "Signal",
      value: `${state.story.radioProgress}`,
      note: "milestones cracked",
      tone: "neutral",
      tip: "Signal progress tracks how far you have pushed the investigations and major radio milestones.",
    });
  }
  if (state.upgrades.includes("radio_rig") || state.upgrades.includes("battery_bank")) {
    pills.push({
      label: "Power",
      value: `${systems.powerSupply}/${systems.powerDemand || 0}`,
      note: systems.powerState === "stable" ? "systems covered" : systems.powerState === "thin" ? "tight reserve" : "modules going dark",
      tone: systems.powerState === "stable" ? "good" : systems.powerState === "thin" ? "warn" : "danger",
      tip: "Power supply keeps radio, lights, and utility systems alive. When demand exceeds supply, coverage and signal systems start going dark.",
    });
  }
  if (state.upgrades.includes("repair_rig") || Object.keys(state.shelter.damage || {}).length) {
    pills.push({
      label: "Maintenance",
      value: `${systems.maintenanceSupport.toFixed(1)}/${systems.maintenanceLoad.toFixed(1)}`,
      note: systems.maintenanceState === "stable" ? "repairs keeping up" : systems.maintenanceState === "strained" ? "line under strain" : "base falling behind",
      tone: systems.maintenanceState === "stable" ? "good" : systems.maintenanceState === "strained" ? "warn" : "danger",
      tip: "Maintenance compares repair capacity to the amount of shelter, crew, and damage you are trying to hold together.",
    });
  }

  byId("summary-strip").innerHTML = pills
    .map((pill) => `
      <div class="summary-pill tone-${pill.tone}" title="${pill.tip}">
        <div class="summary-pill-top">
          <span>${pill.label}</span>
          <strong>${pill.value}</strong>
        </div>
        <small>${pill.note}</small>
      </div>
    `)
    .join("");
}

function renderSubtitle(state) {
  let subtitle = "The streets went quiet. The wires did not.";
  if (state.unlockedSections.includes("upgrades")) {
    subtitle = "Rubble stops being debris once you can turn it into stores, timber, and heat.";
  }
  if (state.unlockedSections.includes("map")) {
    subtitle = "One room becomes a shelter. A shelter becomes a base the second routes start feeding it.";
  }
  if (state.unlockedSections.includes("radio")) {
    subtitle = "The base starts holding long enough for the radio to become another survival problem.";
  }
  if (state.flags.worldReveal) {
    subtitle = "The outbreak had a transmission layer. You are standing inside its residue.";
  }
  byId("world-subtitle").textContent = subtitle;
}

function renderTabBar(state, tabs) {
  byId("tab-bar").innerHTML = tabs
    .map((tab) => {
      return `
        <button
          type="button"
          class="tab-button ${state.ui.activeTab === tab.id ? "is-active" : ""}"
          data-action="set-tab"
          data-tab="${tab.id}"
        >
          <span class="tab-copy">
            <strong>${tab.label}</strong>
            <small>${tab.hint || "section"}</small>
          </span>
          ${countMarkup(tab, state)}
        </button>
      `;
    })
    .join("");
}

function renderMobileBottomNav(state, tabs) {
  const nav = byId("mobile-bottom-nav");
  const primaryTabs = MOBILE_PRIMARY_TABS
    .map((tabId) => tabs.find((tab) => tab.id === tabId))
    .filter(Boolean);
  const moreActive = !MOBILE_PRIMARY_TABS.includes(state.ui.activeTab) || state.ui.mobileMoreOpen;

  nav.innerHTML = `
    ${primaryTabs.map((tab) => `
      <button
        type="button"
        class="mobile-nav-button ${state.ui.activeTab === tab.id ? "is-active" : ""}"
        data-action="set-tab"
        data-tab="${tab.id}"
      >
        <span>${tab.label}</span>
        ${countMarkup(tab, state)}
      </button>
    `).join("")}
    <button
      type="button"
      class="mobile-nav-button ${moreActive ? "is-active" : ""}"
      data-action="toggle-mobile-more"
    >
      <span>More</span>
      <span class="tab-count">${MOBILE_MORE_TABS.filter((tabId) => tabs.some((tab) => tab.id === tabId)).length}</span>
    </button>
  `;
}

function renderMobileSheets(state, tabs) {
  const layer = byId("mobile-sheet-layer");
  const resourceIds = sortedDiscoveredResources(state);
  const secondaryTabs = MOBILE_MORE_TABS
    .map((tabId) => tabs.find((tab) => tab.id === tabId))
    .filter(Boolean);

  if (state.ui.mobileResourceDrawerOpen) {
    layer.innerHTML = `
      <button type="button" class="mobile-sheet-backdrop" data-action="close-mobile-resource-drawer" aria-label="Close resource drawer"></button>
      <section class="mobile-sheet mobile-resource-drawer">
        <div class="mobile-sheet-head">
          <div>
            <span class="note-label">Resources</span>
            <h3>Field reserves</h3>
          </div>
          <button type="button" class="mini-button" data-action="close-mobile-resource-drawer">Close</button>
        </div>
        <div class="mobile-sheet-body mobile-resource-grid">
          ${resourceIds.map((resourceId) => resourcePillMarkup(state, resourceId)).join("")}
        </div>
      </section>
    `;
    return;
  }

  if (state.ui.mobileMoreOpen) {
    layer.innerHTML = `
      <button type="button" class="mobile-sheet-backdrop" data-action="close-mobile-more" aria-label="Close more menu"></button>
      <section class="mobile-sheet mobile-more-sheet">
        <div class="mobile-sheet-head">
          <div>
            <span class="note-label">Sections</span>
            <h3>More</h3>
          </div>
          <button type="button" class="mini-button" data-action="close-mobile-more">Close</button>
        </div>
        <div class="mobile-sheet-body">
          <div class="mobile-sheet-tab-list">
            ${secondaryTabs.map((tab) => `
              <button
                type="button"
                class="mobile-sheet-tab ${state.ui.activeTab === tab.id ? "is-active" : ""}"
                data-action="set-tab"
                data-tab="${tab.id}"
              >
                <span class="mobile-sheet-tab-copy">
                  <strong>${tab.label}</strong>
                  <small>${tab.hint || "section"}</small>
                </span>
                ${countMarkup(tab, state)}
              </button>
            `).join("")}
          </div>
        </div>
      </section>
    `;
    return;
  }

  layer.innerHTML = "";
}

function renderMiniLog(logEntries, limit) {
  return `
    <div class="mini-log">
      ${logEntries.slice(0, limit).map((entry) => `
        <div class="mini-log-line log-${entry.category || "general"}">
          <span>${entry.stamp}</span>
          <p>${entry.text}</p>
        </div>
      `).join("")}
    </div>
  `;
}

function renderSplitPane(mainCards, sideCards, className = "") {
  if (isMobileViewport()) {
    return `
      <div class="tab-mobile-flow ${className}">
        ${[...mainCards, ...sideCards].join("")}
      </div>
    `;
  }

  return `
    <div class="tab-columns ${className}">
      <div class="tab-main-column">${mainCards.join("")}</div>
      <div class="tab-side-column">${sideCards.join("")}</div>
    </div>
  `;
}

function lootBandMarkup(state, sourceId = null) {
  const rows = RARITY_ORDER
    .map((rarityId) => {
      const rarity = RARITY_DEFS[rarityId];
      const entries = SEARCH_LOOT_TABLE.filter((entry) => (
        entry.rarity === rarityId
        && lootMatchesSource(entry, sourceId)
        && contentAvailable(state, entry.requires)
      ));
      if (!entries.length) {
        return "";
      }

      return `
        <div class="rarity-row tier-${rarityId}">
          <div class="surface-head">
            <div>
              <span class="note-label">${rarity.label}</span>
              <h4>${rarity.hint || rarity.label}</h4>
            </div>
            <span class="tag">${entries.length}</span>
          </div>
          <div class="chip-row">${tagList(entries.map((entry) => entry.label || entry.item || entry.resource || entry.id))}</div>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  return rows || `<p class="empty-state">Nothing visible on this band yet.</p>`;
}

function readyUpgradeCandidate(state, upgrades) {
  return upgrades.find((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials)) || null;
}

function currentDirective(state, upgrades) {
  const readyUpgrade = readyUpgradeCandidate(state, upgrades);
  const upkeep = getShelterUpkeep(state);
  const systems = getShelterSystems(state);
  const lowFood = state.unlockedSections.includes("shelter")
    && state.discoveredResources.includes("food")
    && state.resources.food < upkeep.mealCost;
  const lowWater = state.unlockedSections.includes("shelter")
    && state.discoveredResources.includes("water")
    && state.resources.water < upkeep.waterCost;

  if (state.combat) {
    return {
      title: "Combat contact",
      detail: "Resolve the current encounter before you push any other operation.",
    };
  }
  if (lowFood) {
    return {
      title: "Secure food stores",
      detail: `The shelter needs ${upkeep.mealCost} food every ${upkeep.mealHours}h. Do not build past your pantry.`,
    };
  }
  if (lowWater) {
    return {
      title: "Refill drinkable water",
      detail: `The shelter needs ${upkeep.waterCost} drinkable water every ${upkeep.waterHours}h. Dehydration now hits the whole room.`,
    };
  }
  if (systems.maintenanceState === "failing") {
    return {
      title: "Stabilize maintenance",
      detail: "The base is outrunning its repair line. Bank wood, scrap, and parts before the next night tears open more weak seams.",
    };
  }
  if (systems.powerState === "dark") {
    return {
      title: "Cover the power gap",
      detail: "Signal and utility systems are going dark. Feed the base fuel or build reserve power before chasing deeper routes.",
    };
  }
  if (!state.flags.burnUnlocked) {
    return {
      title: "Stabilize the room",
      detail: `${Math.max(0, 3 - state.stats.searches)} more rubble searches unlock warmth control, but every run also raises noise.`,
    };
  }
  if (readyUpgrade) {
    return {
      title: `Build ${readyUpgrade.name}`,
      detail: "A funded project is waiting. Converting salvage into shelter systems is the fastest way forward.",
    };
  }
  if (state.unlockedSections.includes("upgrades") && !state.upgrades.includes("basic_barricade")) {
    return {
      title: "Reinforce the perimeter",
      detail: "Barricade work is the first real line between you and a bad night.",
    };
  }
  if (state.expedition.selectedZone) {
    const preview = getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach);
    if (preview) {
      return {
        title: `Launch ${preview.zone.name}`,
        detail: `${preview.approach.label} route is staged. ${preview.hours}h travel with ${Math.round(preview.encounterChance * 100)}% encounter pressure.`,
      };
    }
  }
  if (state.unlockedSections.includes("radio") && state.resources.fuel > 0 && state.resources.parts > 0) {
    return {
      title: "Sweep the band",
      detail: "The receiver has fuel and parts, but signal work is secondary to holding the shelter together.",
    };
  }
  if (state.unlockedSections.includes("map") && !state.expedition.selectedZone) {
    return {
      title: "Prepare a route",
      detail: "Use the map to stage a zone before the next push. Approach choice now matters.",
    };
  }
  return {
    title: "Loot and hold",
    detail: "Feed the shelter, bank materials, and only then push for the next system or route.",
  };
}

// Keep onboarding to one recommendation at a time so guidance clarifies the loop
// instead of turning into another dense information panel.
function getTutorialStep(state) {
  if (!state.settings.tutorialHints) {
    return null;
  }

  if (!state.player.username) {
    return {
      id: "username",
      title: "Pick a username",
      summary: "Set a handle for this run before the game opens up further.",
      chips: ["one-time setup", "used across the run"],
      tabs: ["overview", "settings"],
      action: {
        action: "set-username",
        label: "Set Username",
        meta: "tutorial step 1",
        variant: "primary compact",
      },
    };
  }

  if (state.combat) {
    return {
      id: "combat",
      title: "Resolve the contact",
      summary: "Combat blocks the rest of the run. Attack for tempo, brace into heavy intents, heal only if needed.",
      chips: ["brace cuts the next hit", "retreat loses ground"],
      tabs: ["overview"],
      action: {
        action: "combat-attack",
        label: "Attack",
        meta: "end the fight",
        variant: "primary compact",
      },
    };
  }

  if (state.stats.searches < 1) {
    return {
      id: "search",
      title: "Start with rubble",
      summary: "Search rubble first. Early runs are how you pull scrap, wood, and the first real survival materials out of the street.",
      chips: ["get scrap", "find wood", "unlock warmth"],
      tabs: ["overview"],
      action: {
        action: "search-rubble",
        label: "Search rubble",
        meta: "tutorial step 2",
        variant: "primary compact",
      },
    };
  }

  if (!state.flags.burnUnlocked) {
    return {
      id: "warmth",
      title: "Unlock warmth control",
      summary: "A few more rubble runs unlock the burn-for-warmth action. That is your first shelter stabilizer, but it is also loud.",
      chips: [`${Math.max(0, 3 - state.stats.searches)} searches left`, "survive today"],
      tabs: ["overview"],
      action: {
        action: "search-rubble",
        label: "Keep scavenging",
        meta: "unlock warmth",
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("upgrades") && !state.upgrades.includes("shelter_stash")) {
    const stashReady = canAfford(state, UPGRADES_BY_ID.shelter_stash.cost) && hasMaterials(state, UPGRADES_BY_ID.shelter_stash.materials);
    return {
      id: "stash",
      title: "Build Shelter Stash first",
      summary: "The stash is the first real pivot from raw panic into shelter management. It means you are building a place, not just hiding in one.",
      chips: ["opens shelter loop", "wood matters now"],
      tabs: ["overview", "craft"],
      action: state.ui.activeTab === "craft" && stashReady
        ? {
            action: "buy-upgrade",
            label: "Build Shelter Stash",
            meta: "first shelter upgrade",
            data: { upgrade: "shelter_stash" },
            variant: "primary compact",
          }
        : {
            action: "set-tab",
            label: "Open Craft",
            meta: stashReady ? "build next" : "check materials",
            data: { tab: "craft" },
            variant: "primary compact",
          },
    };
  }

  if (state.upgrades.includes("shelter_stash") && !state.upgrades.includes("food_search")) {
    const foodReady = canAfford(state, UPGRADES_BY_ID.food_search.cost) && hasMaterials(state, UPGRADES_BY_ID.food_search.materials);
    return {
      id: "food_loop",
      title: "Secure food next",
      summary: "After shelter, food and drinkable water become the next failure point. Secure stores before you over-expand.",
      chips: ["food > comfort", "water is upkeep", "stabilize before routes"],
      tabs: ["overview", "craft"],
      action: state.ui.activeTab === "craft" && foodReady
        ? {
            action: "buy-upgrade",
            label: "Build Simple Food Search",
            meta: "unlock provisions",
            data: { upgrade: "food_search" },
            variant: "primary compact",
          }
        : {
            action: "set-tab",
            label: "Open Craft",
            meta: foodReady ? "build next" : "check materials",
            data: { tab: "craft" },
            variant: "primary compact",
          },
    };
  }

  if (state.unlockedSections.includes("map") && state.stats.expeditions < 1) {
    return {
      id: "first_route",
      title: "Stage the first route",
      summary: "Map runs now need a zone, an objective, and an approach. Start with one clean route instead of trying to learn every system at once.",
      chips: ["pick one zone", "launch one run"],
      tabs: ["overview", "map"],
      action: {
        action: "set-tab",
        label: "Open Map",
        meta: "prepare a route",
        data: { tab: "map" },
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("survivors") && state.survivors.total < 1) {
    return {
      id: "crew",
      title: "Recruit the first survivor",
      summary: "Crew matters once the shelter can feed and water them. One survivor is enough to start learning roles without wrecking your stores.",
      chips: ["roles unlock slowly", "do not overstaff early"],
      tabs: ["overview", "survivors"],
      action: {
        action: state.ui.activeTab === "survivors" ? "recruit" : "set-tab",
        label: state.ui.activeTab === "survivors" ? "Recruit survivor" : "Open Crew",
        meta: state.ui.activeTab === "survivors" ? "22 scrap / 1 wood / 4 food / 2 water" : "crew tab",
        data: state.ui.activeTab === "survivors" ? {} : { tab: "survivors" },
        disabled: state.ui.activeTab === "survivors" && !canAfford(state, { scrap: 22, wood: 1, food: 4, water: 2 }),
        variant: "primary compact",
      },
    };
  }

  if (state.unlockedSections.includes("radio") && state.stats.radioScans < 1) {
    return {
      id: "radio",
      title: "Pick one radio track",
      summary: "Radio progress is directed now. Repeat one investigation until it gives up a milestone.",
      chips: ["tracks are deterministic", "do not spread scans thin"],
      tabs: ["overview", "radio"],
      action: {
        action: state.ui.activeTab === "radio" ? "scan-radio" : "set-tab",
        label: state.ui.activeTab === "radio" ? "Sweep band" : "Open Radio",
        meta: state.ui.activeTab === "radio" ? "1 fuel / 1 parts" : "start signal work",
        data: state.ui.activeTab === "radio" ? {} : { tab: "radio" },
        disabled: state.ui.activeTab === "radio" && (state.resources.fuel < 1 || state.resources.parts < 1),
        variant: "primary compact",
      },
    };
  }

  return null;
}

function renderTutorialBanner(state) {
  const step = getTutorialStep(state);
  if (!step) {
    return "";
  }

  const visibleOnThisTab = state.ui.activeTab === "overview" || step.tabs.includes(state.ui.activeTab);
  if (!visibleOnThisTab) {
    return "";
  }

  if (isMobileViewport()) {
    return `
      <section class="tutorial-strip tutorial-strip-mobile">
        <div class="tutorial-copy">
          <span class="note-label">Guide</span>
          <h3>${step.title}</h3>
          <div class="chip-row">${tagList(step.chips.slice(0, 2))}</div>
        </div>
        <div class="tutorial-actions">
          ${actionButton(step.action)}
          <button type="button" class="mini-button" data-action="skip-tutorial">Skip</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="tutorial-strip">
      <div class="tutorial-copy">
        <span class="note-label">New player guide</span>
        <h3>${step.title}</h3>
        <p class="note">${step.summary}</p>
        <div class="chip-row">${tagList(step.chips)}</div>
      </div>
      <div class="tutorial-actions">
        ${actionButton(step.action)}
        ${actionButton({
          action: "skip-tutorial",
          label: "Skip tutorial",
          meta: "can re-enable in Settings",
          variant: "compact",
        })}
      </div>
    </section>
  `;
}

function renderCommandDesk(state, derived, availableSources, availableUpgrades) {
  const forecast = getNightForecast(state);
  const upkeep = getShelterUpkeep(state);
  const systems = getShelterSystems(state, derived);
  const readyUpgrade = readyUpgradeCandidate(state, availableUpgrades);
  const directive = currentDirective(state, availableUpgrades);
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach)
    : null;
  const highlightAction = (() => {
    if (preview && preview.canLaunch && !state.combat) {
      return actionButton({
        action: "launch-prepared",
        label: `Launch ${preview.zone.name}`,
        meta: `${preview.approach.label} route`,
        variant: "primary compact",
      });
    }
    if (readyUpgrade) {
      return actionButton({
        action: "buy-upgrade",
        label: `${readyUpgrade.verb || "Build"} ${readyUpgrade.name}`,
        meta: "priority build",
        data: { upgrade: readyUpgrade.id },
        variant: "primary compact",
      });
    }
    if (state.flags.burnUnlocked) {
      return actionButton({
        action: "burn-warmth",
        label: "Burn for warmth",
        meta: "12 scrap / immediate relief",
        disabled: state.resources.scrap < 12,
        variant: "compact",
      });
    }
    return actionButton({
      action: "search-rubble",
      label: "Search rubble",
      meta: "default salvage loop",
      variant: "primary compact",
    });
  })();

  return `
    <div class="command-desk">
      <div class="command-card command-primary">
        <span class="note-label">Current directive</span>
        <h4>${directive.title}</h4>
        <p class="note">${directive.detail}</p>
        <div class="command-action">${highlightAction}</div>
      </div>
      <div class="command-card">
        <span class="note-label">Pressure line</span>
        <h4>${forecast.severity}</h4>
        <div class="command-stat-row">
          <div><span>Night</span><strong>${forecast.hoursUntilNight}h</strong></div>
          <div><span>Threat</span><strong>${state.shelter.threat.toFixed(1)}</strong></div>
          <div><span>Noise</span><strong>${state.shelter.noise.toFixed(1)}</strong></div>
          <div><span>Defense</span><strong>${derived.defense}</strong></div>
          <div><span>Siege</span><strong>${Math.round(forecast.siegeChance * 100)}%</strong></div>
        </div>
      </div>
      <div class="command-card">
        <span class="note-label">Route board</span>
        <h4>${preview ? preview.zone.name : "No route staged"}</h4>
        <p class="note">${preview
          ? `${preview.approach.label} / ${preview.hours}h / ${Math.round(preview.encounterChance * 100)}% encounter`
          : state.unlockedSections.includes("map")
            ? "Pick a zone in Map and stage an approach before launch."
            : "Routes surface later. Keep leaning on the city."}</p>
      </div>
      <div class="command-card">
        <span class="note-label">Shelter + growth</span>
        <h4>${state.unlockedSections.includes("radio") ? `Signal ${state.story.radioProgress} / upkeep ${upkeep.mealCost}:${upkeep.waterCost}` : `Upkeep ${upkeep.mealCost}:${upkeep.waterCost}`}</h4>
        <div class="command-stat-row">
          <div><span>Lanes</span><strong>${availableSources.length}</strong></div>
          <div><span>Builds</span><strong>${availableUpgrades.length}</strong></div>
          <div><span>Crew</span><strong>${state.survivors.total}/${derived.survivorCap}</strong></div>
          <div><span>Stores</span><strong>${state.resources.food}/${state.resources.water}</strong></div>
          <div><span>PWR</span><strong>${systems.powerSupply}/${systems.powerDemand}</strong></div>
          <div><span>MNT</span><strong>${systems.maintenanceState}</strong></div>
        </div>
      </div>
    </div>
  `;
}

function renderInventoryItemCard(itemId, amount) {
  const item = ITEMS[itemId];
  let actionMarkup = `<div class="chip-row">${tagList(["stored"])}</div>`;
  if (item.type === "weapon" || item.type === "armor") {
    actionMarkup = actionButton({
      action: "equip-item",
      label: `Equip ${item.name}`,
      meta: item.type,
      data: { item: itemId },
    });
  } else if (item.type === "consumable") {
    actionMarkup = actionButton({
      action: "use-item",
      label: `Use ${item.name}`,
      meta: item.type,
      data: { item: itemId },
    });
  } else if (item.type === "tool") {
    actionMarkup = `<div class="chip-row">${tagList(["tool", "passive utility"])}</div>`;
  }

  return `
    <div class="list-block inventory-item-card">
      <div class="surface-head">
        <h4>${item.name}</h4>
        <span class="tag">${item.type} x${amount}</span>
      </div>
      <p class="note">${item.description}</p>
      ${actionMarkup}
    </div>
  `;
}

function renderSignalSpectrum(state) {
  const activeBands = Math.max(1, Math.min(6, state.story.radioProgress + (state.flags.worldReveal ? 2 : 1)));
  return `
    <div class="signal-spectrum ${state.flags.worldReveal ? "is-revealed" : ""}" aria-hidden="true">
      ${Array.from({ length: 6 }, (_, index) => `
        <span class="signal-bar ${index < activeBands ? "is-hot" : ""}"></span>
      `).join("")}
    </div>
  `;
}

function renderCrewPressure(state) {
  const wounded = state.survivors.roster.filter((survivor) => survivor.wounded > 0).length;
  const stressed = state.survivors.roster.filter((survivor) => survivor.stress >= 4).length;
  const bands = [
    { label: "Scavengers", value: state.survivors.assigned.scavenger, note: "salvage yield" },
    { label: "Guards", value: state.survivors.assigned.guard, note: "night defense" },
    { label: "Medics", value: state.survivors.assigned.medic, note: "condition mitigation" },
    { label: "Scouts", value: state.survivors.assigned.scout, note: "route yield and escape" },
    { label: "Tuners", value: state.survivors.assigned.tuner, note: "radio depth and pathing" },
    { label: "Wounded", value: wounded, note: "reduced output" },
    { label: "Stressed", value: stressed, note: "conflict risk" },
  ];

  return `
    <div class="crew-band-grid">
      ${bands.map((band) => `
        <div class="crew-band-card">
          <span>${band.label}</span>
          <strong>${band.value}</strong>
          <small>${band.note}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function renderFactionStatus(state) {
  const aligned = FACTIONS.find((faction) => faction.id === state.faction.aligned);
  return `
    <div class="faction-status-board">
      <div class="faction-status-copy">
        <span class="note-label">Alignment status</span>
        <h4>${aligned ? aligned.name : "No faction chosen"}</h4>
        <p class="note">${aligned ? aligned.description : "You are still independent. Every side is watching."}</p>
      </div>
      <div class="chip-row">${tagList(aligned ? aligned.bonuses : ["independent", "open market only"])}</div>
      ${aligned?.costs?.length ? `<div class="chip-row">${tagList(aligned.costs)}</div>` : ""}
    </div>
  `;
}

function renderLogPulse(state) {
  const orderedCategories = ["loot", "build", "night", "expedition", "radio", "combat", "notable"];
  const counts = orderedCategories
    .map((category) => ({
      category,
      amount: state.log.filter((entry) => (entry.category || "general") === category).length,
    }))
    .filter((entry) => entry.amount > 0);

  return `
    <div class="log-pulse-stack">
      ${counts.length ? counts.map((entry) => `
        <div class="log-pulse-row log-${entry.category}">
          <span>${entry.category}</span>
          <strong>${entry.amount}</strong>
        </div>
      `).join("") : `<p class="empty-state">No categorized entries yet.</p>`}
    </div>
  `;
}

function renderAnomalyTrace(state) {
  const heat = Math.min(6, Math.max(1, state.story.radioProgress + Math.floor(state.story.secretProgress / 2) + (state.flags.worldReveal ? 1 : 0)));
  const fragments = [
    "carrier echo / tower should be dead",
    "civil band bleed / impossible handoff",
    state.flags.bunkerRouteKnown ? "sub-level route / bunker latch humming" : "sub-level route / not yet fixed",
    state.flags.worldReveal ? "dead static / engineered residue confirmed" : "dead static / origin still hidden",
  ];

  return `
    <div class="detail-list">
      <div class="anomaly-trace ${state.flags.worldReveal ? "is-open" : ""}" aria-hidden="true">
        ${Array.from({ length: 6 }, (_, index) => `
          <span class="trace-node ${index < heat ? "is-hot" : ""}"></span>
        `).join("")}
      </div>
      <div class="ghost-feed">
        ${fragments.map((fragment, index) => `
          <div class="ghost-line">
            <span>trace ${String(index + 1).padStart(2, "0")}</span>
            <p>${fragment}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}


// render/shelter-map.js
const SHELTER_MAP_STRUCTURES = [
  { id: "shelter_core", label: "Held Room", short: "HQ", detail: "main room", kind: "core", sprite: "core", col: 6, row: 4, active: (state) => state.unlockedSections.includes("shelter") },
  { id: "shelter_stash", label: "Stash", short: "ST", detail: "secure cache", kind: "core", sprite: "stash", col: 5, row: 5, upgrade: "shelter_stash" },
  { id: "campfire", label: "Campfire", short: "CF", detail: "heat pit", kind: "core", sprite: "campfire", col: 6, row: 6, upgrade: "campfire" },
  { id: "survivor_cots", label: "Cots", short: "CT", detail: "sleep line", kind: "support", sprite: "cots", col: 3, row: 5, upgrade: "survivor_cots" },
  { id: "smokehouse", label: "Smokehouse", short: "SH", detail: "food cure", kind: "support", sprite: "smokehouse", col: 2, row: 7, upgrade: "smokehouse" },
  { id: "rain_collector", label: "Collector", short: "RC", detail: "rain catch", kind: "utility", sprite: "collector", col: 2, row: 3, upgrade: "rain_collector" },
  { id: "water_still", label: "Water Still", short: "WS", detail: "clean flow", kind: "support", sprite: "collector", col: 3, row: 3, upgrade: "water_still" },
  { id: "crafting_bench", label: "Workbench", short: "WB", detail: "build line", kind: "utility", sprite: "bench", col: 8, row: 5, upgrade: "crafting_bench" },
  { id: "ammo_press", label: "Ammo Press", short: "AP", detail: "round press", kind: "utility", sprite: "press", col: 9, row: 5, upgrade: "ammo_press" },
  { id: "repair_rig", label: "Repair Rig", short: "RR", detail: "line repair", kind: "utility", sprite: "press", col: 8, row: 7, upgrade: "repair_rig" },
  { id: "watch_post", label: "Watch Post", short: "WT", detail: "tower eyes", kind: "defense", sprite: "tower", col: 11, row: 2, upgrade: "watch_post" },
  { id: "tripwire_grid", label: "Tripwire Grid", short: "TW", detail: "outer snare", kind: "defense", sprite: "mesh", col: 10, row: 6, upgrade: "tripwire_grid" },
  { id: "flood_lights", label: "Flood Lights", short: "FL", detail: "hard light", kind: "defense", sprite: "beacon", col: 10, row: 3, upgrade: "flood_lights" },
  { id: "radio_rig", label: "Radio", short: "RD", detail: "receiver", kind: "signal", sprite: "radio", col: 6, row: 2, upgrade: "radio_rig" },
  { id: "signal_decoder", label: "Decoder", short: "SD", detail: "signal parse", kind: "signal", sprite: "decoder", col: 7, row: 2, upgrade: "signal_decoder" },
  { id: "battery_bank", label: "Battery Bank", short: "BB", detail: "reserve cells", kind: "signal", sprite: "decoder", col: 8, row: 3, upgrade: "battery_bank" },
  { id: "trader_beacon", label: "Signal Beacon", short: "SB", detail: "tower mark", kind: "signal", sprite: "beacon", col: 8, row: 2, upgrade: "trader_beacon" },
  { id: "faraday_mesh", label: "Mesh Node", short: "FM", detail: "shield anchor", kind: "signal", sprite: "mesh", col: 2, row: 1, upgrade: "faraday_mesh" },
  { id: "relay_tap", label: "Relay Tap", short: "RT", detail: "stolen feed", kind: "signal", sprite: "relay", col: 10, row: 1, upgrade: "relay_tap" },
  { id: "bunker_drill", label: "Drill", short: "BD", detail: "deep breach", kind: "utility", sprite: "drill", col: 9, row: 7, upgrade: "bunker_drill" },
];

const SHELTER_MAP_ANNEXES = [
  { upgrade: "food_crate", label: "Food Storage", kind: "support", sprite: "crate" },
  { upgrade: "weapon_rack", label: "Weapon Rack", kind: "utility", sprite: "rack" },
  { upgrade: "armor_hooks", label: "Armor Hooks", kind: "utility", sprite: "hooks" },
  { upgrade: "auto_scavenger", label: "Auto Scavenger", kind: "utility", sprite: "crawler" },
  { upgrade: "scout_bike", label: "Scout Bike", kind: "support", sprite: "bike" },
  { upgrade: "carpenter_kit", label: "Carpenter Kit", kind: "utility", sprite: "bench" },
  { upgrade: "hand_drill", label: "Hand Drill", kind: "utility", sprite: "press" },
  { upgrade: "signal_meter", label: "Signal Meter", kind: "signal", sprite: "decoder" },
];

const SHELTER_MAP_PERIMETER = {
  id: "basic_barricade",
  label: "Perimeter Fence",
  short: "PF",
  kind: "defense",
  sprite: "gate",
};

function structureKey(structure) {
  return structure.upgrade || structure.id;
}

function structureByKey(structureId) {
  if (structureId === SHELTER_MAP_PERIMETER.id) {
    return SHELTER_MAP_PERIMETER;
  }
  return SHELTER_MAP_STRUCTURES.find((structure) => structureKey(structure) === structureId) || SHELTER_MAP_STRUCTURES[0];
}

function structureCrewNote(structureId) {
  const map = {
    watch_post: "guards amplify it",
    tripwire_grid: "guards reset and read it",
    flood_lights: "guards and fuel keep it useful",
    radio_rig: "tuners feed it",
    signal_decoder: "tuners sharpen it",
    trader_beacon: "tuners and fuel keep it useful",
    battery_bank: "repair crew keeps it charged",
    smokehouse: "scavengers keep it stocked",
    repair_rig: "medics and builders stabilize it",
    water_still: "support line keeps it fed",
    survivor_cots: "crew capacity anchor",
  };
  return map[structureId] || "self-run once built";
}

function structureSignals(structureId, state, derived) {
  const effects = UPGRADES_BY_ID[structureId]?.effects || {};
  const tags = [];

  if (effects.passive) {
    Object.entries(effects.passive).forEach(([resourceId, amount]) => {
      if (amount > 0) {
        tags.push(`${resourceLabel(resourceId)} +${amount.toFixed(2)}/s`);
      }
    });
  }
  if (effects.defense) {
    tags.push(`DEF +${effects.defense}`);
  }
  if (effects.attack) {
    tags.push(`ATK +${effects.attack}`);
  }
  if (effects.radioDepth) {
    tags.push(`SIG +${effects.radioDepth.toFixed(1)}`);
  }
  if (effects.power) {
    tags.push(`PWR +${effects.power}`);
  }
  if (effects.coverage) {
    tags.push(`CVR +${effects.coverage.toFixed(1)}`);
  }
  if (effects.repairPower) {
    tags.push(`REP +${effects.repairPower}`);
  }
  if (effects.maintenance) {
    tags.push(`MNT +${effects.maintenance}`);
  }
  if (effects.survivorCap) {
    tags.push(`Crew +${effects.survivorCap}`);
  }
  if (!tags.length && structureId === "basic_barricade") {
    tags.push(`DEF +${Math.max(2, Math.floor(derived.defense / 3))}`);
  }
  if (!tags.length && structureId === "shelter_core") {
    tags.push("holds the line");
  }

  return tags;
}

function structureStatus(structureId, state, derived) {
  const systems = getShelterSystems(state, derived);
  const damage = getStructureDamage(state, structureId);
  const built = structureId === "shelter_core" || state.upgrades.includes(structureId);
  const isSignal = ["radio_rig", "signal_decoder", "battery_bank", "trader_beacon", "faraday_mesh", "relay_tap"].includes(structureId);
  const isUtility = ["crafting_bench", "ammo_press", "bunker_drill", "repair_rig"].includes(structureId);
  let powered = built;
  let active = built;

  if (structureId === "campfire") {
    powered = state.shelter.warmth > 0.4;
    active = powered;
  } else if (structureId === "flood_lights") {
    powered = built && systems.powerGap <= 0;
    active = powered && state.survivors.assigned.guard > 0;
  } else if (isSignal) {
    powered = built && (systems.powerGap <= 0 || state.resources.fuel > 0 || state.resources.electronics > 0 || state.story.radioProgress > 0);
    active = powered && (state.story.radioProgress > 0 || state.unlockedSections.includes("radio"));
  } else if (structureId === "watch_post") {
    active = built && (state.survivors.assigned.guard > 0 || derived.defense >= 3);
  } else if (structureId === "tripwire_grid") {
    active = built && (state.survivors.assigned.guard > 0 || state.resources.wire > 0);
  } else if (structureId === "smokehouse") {
    active = built && (state.resources.food > 0 || derived.passive.food > 0);
  } else if (structureId === "water_still") {
    active = built && (state.resources.fuel > 0 || derived.waterSecurity > 0);
  } else if (structureId === "ammo_press") {
    powered = built && state.resources.parts > 0;
    active = powered && state.resources.chemicals > 0;
  } else if (structureId === "battery_bank") {
    powered = built;
    active = built && state.resources.fuel > 0;
  } else if (structureId === "bunker_drill") {
    powered = built && state.resources.fuel > 0;
    active = powered && state.flags.bunkerRouteKnown;
  } else if (isUtility) {
    active = built && damage < 2 && systems.maintenanceState !== "failing";
  }

  let label = "active";
  let className = "is-active";
  if (damage >= 2) {
    label = "damaged";
    className = "is-damaged";
  } else if (!powered) {
    label = "unpowered";
    className = "is-unpowered";
  } else if (!active) {
    label = "idle";
    className = "is-idle";
  }

  return {
    built,
    damage,
    powered,
    active,
    label,
    className,
    telemetry: structureSignals(structureId, state, derived),
    crew: structureCrewNote(structureId),
  };
}

function structureStatusBadge(status) {
  if (status.damage >= 2) {
    return `DMG ${status.damage}`;
  }
  if (status.className === "is-unpowered") {
    return "DARK";
  }
  if (status.className === "is-idle") {
    return "IDLE";
  }
  return "LIVE";
}

function inspectedStructureId(state) {
  const selected = state.ui.mobileInspectorStructure || state.ui.inspectedStructure;
  if (selected === "shelter_core" || state.upgrades.includes(selected) || selected === SHELTER_MAP_PERIMETER.id) {
    return selected;
  }
  if (state.upgrades.includes(SHELTER_MAP_PERIMETER.id)) {
    return SHELTER_MAP_PERIMETER.id;
  }
  return "shelter_core";
}

function shelterStructureBuilt(state, structure) {
  if (typeof structure.active === "function") {
    return structure.active(state);
  }
  return Boolean(structure.upgrade && state.upgrades.includes(structure.upgrade));
}

function getBuiltShelterStructures(state) {
  return SHELTER_MAP_STRUCTURES.filter((structure) => shelterStructureBuilt(state, structure));
}

function getShelterMapPerimeter(state) {
  if (!state.upgrades.includes(SHELTER_MAP_PERIMETER.id)) {
    return null;
  }

  return {
    ...SHELTER_MAP_PERIMETER,
    detail: state.upgrades.includes("faraday_mesh")
      ? "scrap fence wrapped in grounded mesh"
      : "scrap fence and wired gate",
  };
}

function renderShelterFence(state) {
  const perimeter = getShelterMapPerimeter(state);
  if (!perimeter) {
    return "";
  }

  return `
    <div class="map-fence ${state.upgrades.includes("faraday_mesh") ? "has-mesh" : ""}" aria-hidden="true">
      <div class="fence-segment fence-top"></div>
      <div class="fence-segment fence-left"></div>
      <div class="fence-segment fence-right"></div>
      <div class="fence-segment fence-bottom-left"></div>
      <div class="fence-segment fence-bottom-right"></div>
      <div class="fence-gate">
        <span></span>
        <span></span>
      </div>
      <span class="fence-post post-nw"></span>
      <span class="fence-post post-ne"></span>
      <span class="fence-post post-sw"></span>
      <span class="fence-post post-se"></span>
      <span class="fence-post post-gate-left"></span>
      <span class="fence-post post-gate-right"></span>
    </div>
  `;
}

function getOutpostStage(activeCount) {
  if (activeCount <= 2) {
    return "Held Corner";
  }
  if (activeCount <= 6) {
    return "Scrap Shelter";
  }
  if (activeCount <= 10) {
    return "Working Outpost";
  }
  return "Signal Compound";
}

function mapStructureByUpgrade(upgradeId) {
  return SHELTER_MAP_STRUCTURES.find((structure) => structure.upgrade === upgradeId) || null;
}

function renderPlannedStructureCard(state, upgrade) {
  const structure = mapStructureByUpgrade(upgrade.id);
  const meta = [];
  if (Object.keys(upgrade.cost || {}).length) {
    meta.push(formatCost(upgrade.cost));
  }
  if (upgrade.materials && Object.keys(upgrade.materials).length) {
    meta.push(formatMaterials(upgrade.materials));
  }
  if (structure?.col && structure?.row) {
    meta.push(`Grid ${structure.col}-${structure.row}`);
  }

  return `
    <div class="ghost-card kind-${structure?.kind || "utility"} sprite-${structure?.sprite || "bench"}">
      <div class="surface-head">
        <div>
          <span class="note-label">Planned slot</span>
          <h4>${upgrade.name}</h4>
        </div>
        <span class="tag">${structure?.short || "PL"}</span>
      </div>
      <div class="ghost-preview">
        <div class="map-sprite small-sprite ghost-sprite">
          <span class="sprite-ground"></span>
          <span class="sprite-body"></span>
          <span class="sprite-accent"></span>
        </div>
      </div>
      <p class="note">${upgrade.description}</p>
      ${meta.length ? `<div class="chip-row">${tagList(meta)}</div>` : ""}
      ${actionButton({
        action: "buy-upgrade",
        label: `${upgrade.verb || "Build"} ${upgrade.name}`,
        meta: "slot ready",
        disabled: !(canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials)),
        data: { upgrade: upgrade.id },
        variant: "compact slot-trigger",
      })}
    </div>
  `;
}

function renderMapStructureButton(state, structure, derived, mobile = false) {
  const id = structureKey(structure);
  const status = structureStatus(id, state, derived);
  const tooltip = `${structure.label}: ${status.label}. ${status.telemetry[0] || structure.detail || "built"}. Grid ${structure.col}-${structure.row}.`;
  const selected = inspectedStructureId(state) === id;
  const showLabel = !mobile || selected || status.damage >= 2 || ["watch_post", "radio_rig", "campfire"].includes(structure.id);

  return `
    <button
      type="button"
      class="map-structure kind-${structure.kind} sprite-${structure.sprite} ${status.className} ${selected ? "is-selected" : ""} ${mobile && !showLabel ? "is-mobile-minimal" : ""}"
      style="--col:${structure.col}; --row:${structure.row};"
      data-action="inspect-structure"
      data-structure="${id}"
      data-tooltip="${tooltip}"
      title="${tooltip}"
      aria-label="${tooltip}"
    >
      <span class="structure-chip">${structureStatusBadge(status)}</span>
      <div class="map-sprite">
        <span class="sprite-ground"></span>
        <span class="sprite-body"></span>
        <span class="sprite-accent"></span>
      </div>
      ${showLabel ? `<span class="structure-name">${structure.short || structure.label}</span>` : ""}
    </button>
  `;
}

function renderStructureInspector(state) {
  const derived = getDerivedState(state);
  const structureId = inspectedStructureId(state);
  const structure = structureByKey(structureId);
  const status = structureStatus(structureId, state, derived);
  const cost = getRepairCost(state, structureId);
  const telemetry = status.telemetry.length ? status.telemetry : [structure.detail || "built"];
  const detail = structureId === SHELTER_MAP_PERIMETER.id
    ? getShelterMapPerimeter(state)?.detail || "scrap fence and wired gate"
    : structure.detail || "main shelter anchor";

  return `
    <div class="detail-list">
      <div class="list-block compact-block inspector-block">
        <div class="surface-head">
          <div>
            <span class="note-label">Selected structure</span>
            <h4>${structure.label}</h4>
          </div>
          <span class="tag ${status.className.replace("is-", "")}">${status.label}</span>
        </div>
        <div class="inspector-sprite sprite-${structure.sprite || "core"} kind-${structure.kind || "core"}">
          <div class="map-sprite">
            <span class="sprite-ground"></span>
            <span class="sprite-body"></span>
            <span class="sprite-accent"></span>
          </div>
        </div>
        <p class="note">${detail}</p>
        <div class="fact-grid">
          <div class="fact"><span>Integrity</span><strong>${Math.max(0, 3 - status.damage)}/3</strong></div>
          <div class="fact"><span>Crew use</span><strong>${status.crew}</strong></div>
          ${structure.col && structure.row ? `<div class="fact"><span>Grid</span><strong>${structure.col}-${structure.row}</strong></div>` : ""}
        </div>
        <div class="chip-row">${tagList(telemetry)}</div>
        ${Object.keys(cost).length
          ? actionButton({
            action: "repair-structure",
            label: `Repair ${structure.label}`,
            meta: formatCost(cost),
            disabled: !canAfford(state, cost),
            data: { structure: structureId },
            variant: "compact",
          })
          : `<p class="empty-state">No repair work queued.</p>`}
        <div class="action-row">
          <button type="button" class="mini-button" data-action="set-tab" data-tab="craft">Craft</button>
          <button type="button" class="mini-button" data-action="set-tab" data-tab="shelter">Shelter</button>
        </div>
      </div>
    </div>
  `;
}

function renderCompoundDistricts(state, structures, perimeter) {
  const districts = [
    {
      id: "perimeter",
      label: "Perimeter",
      note: "wall line, gate, and exterior control",
      entries: perimeter ? [perimeter.label] : [],
      status: perimeter ? structureStatus(SHELTER_MAP_PERIMETER.id, state, getDerivedState(state)).label : "open",
    },
    {
      id: "core",
      label: "Core",
      note: "heat, stash, and immediate living space",
      entries: structures.filter((structure) => structure.kind === "core").map((structure) => structure.label),
      status: "live",
    },
    {
      id: "support",
      label: "Support Row",
      note: "rest, food, and day-to-day sustain",
      entries: structures.filter((structure) => structure.kind === "support").map((structure) => structure.label),
      status: structures.some((structure) => structure.kind === "support") ? "online" : "dark",
    },
    {
      id: "utility",
      label: "Workline",
      note: "production, press work, and excavation",
      entries: structures.filter((structure) => structure.kind === "utility").map((structure) => structure.label),
      status: structures.some((structure) => structure.kind === "utility") ? "online" : "sparse",
    },
    {
      id: "signal",
      label: "Signal Edge",
      note: "receiver chain and long-range systems",
      entries: structures.filter((structure) => structure.kind === "signal" || structure.kind === "defense").map((structure) => structure.label),
      status: structures.some((structure) => structure.kind === "signal") ? "hot" : "quiet",
    },
  ];

  return `
    <div class="district-grid">
      ${districts.map((district) => `
        <div class="district-card district-${district.id}">
          <div class="surface-head">
            <div>
              <span class="note-label">District</span>
              <h4>${district.label}</h4>
            </div>
            <span class="tag">${district.status}</span>
          </div>
          <p class="note">${district.note}</p>
          ${district.entries.length
            ? `<div class="chip-row">${tagList(district.entries)}</div>`
            : `<p class="empty-state">No live structures here.</p>`}
        </div>
      `).join("")}
    </div>
  `;
}

function renderShelterMapBoard(state, mobile = false) {
  const structures = getBuiltShelterStructures(state);
  const perimeter = getShelterMapPerimeter(state);
  const activeCount = structures.length + (perimeter ? 1 : 0);
  const totalCount = SHELTER_MAP_STRUCTURES.length + 1;
  const meshed = state.upgrades.includes("faraday_mesh");
  const derived = getDerivedState(state);
  const damageCount = [SHELTER_MAP_PERIMETER.id, ...structures.map((structure) => structureKey(structure))]
    .filter((id, index) => (index === 0 ? Boolean(perimeter) || id !== SHELTER_MAP_PERIMETER.id : true))
    .reduce((total, structureId) => total + (getStructureDamage(state, structureId) >= 2 ? 1 : 0), 0);

  return `
    <div class="shelter-map-shell">
      <div class="outpost-headline">
        <div>
          <span class="note-label">Outpost stage</span>
          <strong>${getOutpostStage(activeCount)}</strong>
        </div>
        <div>
          <span class="note-label">Structures live</span>
          <strong>${activeCount}/${totalCount}</strong>
        </div>
        <div>
          <span class="note-label">Compound state</span>
          <strong>${damageCount ? "Needs repair" : "Stable"}</strong>
        </div>
      </div>
      <div class="shelter-map ${meshed ? "has-mesh" : ""} ${mobile ? "is-mobile-board" : ""}">
        <div class="map-compound-floor"></div>
        <div class="map-path gate-lane"></div>
        ${renderShelterFence(state)}
        ${structures.map((structure) => renderMapStructureButton(state, structure, derived, mobile)).join("")}
        ${perimeter ? `
          <button
            type="button"
            class="map-perimeter-button ${structureStatus(SHELTER_MAP_PERIMETER.id, state, derived).className} ${inspectedStructureId(state) === SHELTER_MAP_PERIMETER.id ? "is-selected" : ""}"
            style="--col:6; --row:8;"
            data-action="inspect-structure"
            data-structure="${SHELTER_MAP_PERIMETER.id}"
            data-tooltip="Perimeter Fence: ${structureStatus(SHELTER_MAP_PERIMETER.id, state, derived).label}. ${structureStatus(SHELTER_MAP_PERIMETER.id, state, derived).telemetry[0] || "holds the edge"}"
            title="Perimeter Fence"
          >
            <span>Gate</span>
          </button>
        ` : ""}
      </div>
    </div>
  `;
}

function renderMobileStructureInspector(state) {
  const derived = getDerivedState(state);
  const structureId = inspectedStructureId(state);
  const structure = structureByKey(structureId);
  const status = structureStatus(structureId, state, derived);
  const cost = getRepairCost(state, structureId);
  const telemetry = status.telemetry.length ? status.telemetry : [structure.detail || "built"];

  return `
    <div class="mobile-inspector-sheet">
      <button type="button" class="mobile-sheet-backdrop" data-action="close-mobile-inspector" aria-label="Close structure inspector"></button>
      <section class="mobile-sheet mobile-structure-sheet">
        <div class="mobile-sheet-head">
          <div>
            <span class="note-label">Structure</span>
            <h3>${structure.label}</h3>
          </div>
          <button type="button" class="mini-button" data-action="close-mobile-inspector">Close</button>
        </div>
        <div class="mobile-sheet-body">
          <div class="fact-grid">
            <div class="fact"><span>State</span><strong>${status.label}</strong></div>
            <div class="fact"><span>Integrity</span><strong>${Math.max(0, 3 - status.damage)}/3</strong></div>
            ${structure.col && structure.row ? `<div class="fact"><span>Grid</span><strong>${structure.col}-${structure.row}</strong></div>` : ""}
          </div>
          <div class="chip-row">${tagList(telemetry)}</div>
          ${Object.keys(cost).length
            ? actionButton({
              action: "repair-structure",
              label: `Repair ${structure.label}`,
              meta: formatCost(cost),
              disabled: !canAfford(state, cost),
              data: { structure: structureId },
              variant: "primary compact",
            })
            : `<p class="empty-state">No repair work queued.</p>`}
        </div>
      </section>
    </div>
  `;
}

function renderShelterMapMobilePanel(state) {
  const builtStructures = getBuiltShelterStructures(state);
  const perimeter = getShelterMapPerimeter(state);
  const visibleStructures = perimeter ? [perimeter, ...builtStructures] : builtStructures;
  const nextBuilds = getVisibleUpgrades(state)
    .filter((upgrade) => !state.upgrades.includes(upgrade.id) && SHELTER_MAP_STRUCTURES.some((structure) => structure.upgrade === upgrade.id))
    .slice(0, 4);

  return `
    <div class="shelter-mobile-map-view">
      ${surfaceCard({
        title: "Shelter map",
        meta: `${getOutpostStage(visibleStructures.length)}`,
        className: "map-primary-card mobile-map-card",
        body: `
          ${renderShelterMapBoard(state, true)}
          <p class="note mobile-map-note">Tap a structure for state, effect, and repair access.</p>
        `,
      })}
      ${nextBuilds.length ? surfaceCard({
        title: "Planned works",
        meta: `${nextBuilds.length} open`,
        body: `
          <details class="mobile-accordion">
            <summary>
              <span>Open planned works</span>
              <span class="tag">${nextBuilds.length}</span>
            </summary>
            <div class="mobile-accordion-body ghost-grid">
              ${nextBuilds.map((upgrade) => renderPlannedStructureCard(state, upgrade)).join("")}
            </div>
          </details>
        `,
      }) : ""}
      ${state.ui.mobileInspectorStructure ? renderMobileStructureInspector(state) : ""}
    </div>
  `;
}

function renderShelterMapTab(state) {
  const builtStructures = getBuiltShelterStructures(state);
  const perimeter = getShelterMapPerimeter(state);
  const visibleStructures = perimeter ? [perimeter, ...builtStructures] : builtStructures;
  const activeCount = visibleStructures.length;
  const visibleSources = getAvailableScavengeSources(state);
  const nextBuilds = getVisibleUpgrades(state)
    .filter((upgrade) => !state.upgrades.includes(upgrade.id) && SHELTER_MAP_STRUCTURES.some((structure) => structure.upgrade === upgrade.id))
    .slice(0, 4);
  const annexes = SHELTER_MAP_ANNEXES.filter((entry) => state.upgrades.includes(entry.upgrade));

  return renderSplitPane(
    [
      surfaceCard({
        title: "Shelter map",
        meta: `${getOutpostStage(activeCount)}`,
        className: "map-primary-card",
        body: renderShelterMapBoard(state),
      }),
      surfaceCard({
        title: "Compound feeds",
        meta: `${annexes.length} annexes / ${visibleSources.length} lanes`,
        className: "compound-feed-card",
        body: `
          <div class="compound-feed-grid">
            <div class="list-block compound-feed-block">
              <div class="surface-head">
                <h4>Annex systems</h4>
                <span class="tag">${annexes.length}</span>
              </div>
              ${annexes.length
                ? `<div class="annex-strip">${annexes.map((annex) => `
                <div class="annex-card kind-${annex.kind} sprite-${annex.sprite}">
                  <div class="map-sprite small-sprite">
                    <span class="sprite-ground"></span>
                    <span class="sprite-body"></span>
                    <span class="sprite-accent"></span>
                  </div>
                  <span>${annex.label}</span>
                </div>
              `).join("")}</div>`
                : `<p class="empty-state">No annexes attached yet.</p>`}
            </div>
            <div class="list-block compound-feed-block">
              <div class="surface-head">
                <h4>Supply lanes</h4>
                <span class="tag">${visibleSources.length}</span>
              </div>
              <div class="detail-list compact-list">
                ${visibleSources.slice(0, 4).map((source) => `
                  <div class="list-block compact-block">
                    <div class="surface-head">
                      <h4>${source.label}</h4>
                      <span class="tag">${sourceRarityCeiling(state, source.id).label}</span>
                    </div>
                    <p class="note">${source.focus.join(" / ")}</p>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Structure inspector",
        meta: `${visibleStructures.length} built`,
        body: renderStructureInspector(state),
      }),
      surfaceCard({
        title: "District ledger",
        meta: `${getOutpostStage(activeCount)}`,
        body: renderCompoundDistricts(state, builtStructures, perimeter),
      }),
      surfaceCard({
        title: "Planned works",
        meta: `${nextBuilds.length} open`,
        body: nextBuilds.length
          ? `<div class="ghost-grid">${nextBuilds.map((upgrade) => renderPlannedStructureCard(state, upgrade)).join("")}</div>`
          : `<p class="empty-state">No immediate structure slots are waiting. Push into higher systems.</p>`,
      }),
    ],
    "tab-columns-shelter-map"
  );
}


// services/leaderboard.js
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

function calculateLeaderboardScore(summary) {
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

function initLeaderboard({ onChange } = {}) {
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

function getLeaderboardState() {
  return store;
}

function getLeaderboardSnapshot(state) {
  const summary = summarizeRun(state);
  const playerName = sanitizeCodename(store.profile.codename || state?.player?.username || "");
  return {
    playerId: store.profile.playerId,
    playerName,
    summary,
  };
}

function setLeaderboardUsername(value, { silent = false } = {}) {
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

function promptForCallsign() {
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

async function refreshLeaderboard({ silent = false } = {}) {
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

async function submitLeaderboardScore(state) {
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


// render/stage.js
function tabStageMeta(state, derived) {
  const visibleUpgrades = getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const readyUpgrades = visibleUpgrades.filter((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials));
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach)
    : null;
  const perimeter = getShelterMapPerimeter(state);
  const builtStructures = getBuiltShelterStructures(state);
  const activeCount = builtStructures.length + (perimeter ? 1 : 0);

  switch (state.ui.activeTab) {
    case "craft":
      return {
        label: "Build queue",
        title: "Convert salvage into systems",
        detail: "Ready systems first. Blocked ones define the next hunt.",
        stats: [
          ["Ready", readyUpgrades.length],
          ["Blocked", Math.max(0, visibleUpgrades.length - readyUpgrades.length)],
          ["Built", state.upgrades.length],
          ["Lanes", getAvailableScavengeSources(state).length],
        ],
      };
    case "inventory":
      return {
        label: "Stores",
        title: "Everything you can still carry",
        detail: "Loadout, kit, and strange salvage in one clean read.",
        stats: [
          ["Weapon", state.equipped.weapon ? "set" : "none"],
          ["Armor", state.equipped.armor ? "set" : "none"],
          ["Items", Object.values(state.inventory).reduce((sum, amount) => sum + amount, 0)],
          ["Ammo", state.resources.ammo],
        ],
      };
    case "shelter":
      return {
        label: "Survival board",
        title: "Hold the room through another night",
        detail: "Warmth, threat, noise, and food decide whether the room holds.",
        stats: [
          ["Warmth", state.shelter.warmth.toFixed(1)],
          ["Threat", state.shelter.threat.toFixed(1)],
          ["Noise", state.shelter.noise.toFixed(1)],
          ["Defense", derived.defense],
        ],
      };
    case "shelter_map":
      return {
        label: "Compound view",
        title: "Read the outpost like a living machine",
        detail: "Compound footprint, live systems, and damage in one board.",
        stats: [
          ["Stage", getOutpostStage(activeCount)],
          ["Built", activeCount],
          ["Annexes", SHELTER_MAP_ANNEXES.filter((entry) => state.upgrades.includes(entry.upgrade)).length],
          ["Integrity", builtStructures.filter((structure) => getStructureDamage(state, structureKey(structure)) >= 2).length || "stable"],
        ],
      };
    case "map":
      return {
        label: "Route board",
        title: "Stage the next push before you leave",
        detail: "Pick a zone, set an objective, choose a route, then pay for it.",
        stats: [
          ["Zones", state.unlockedZones.length],
          ["Prepared", preview ? preview.zone.name : "none"],
          ["Approach", preview ? preview.approach.label : "unset"],
          ["Runs", state.stats.expeditions],
        ],
      };
    case "survivors":
      return {
        label: "Crew line",
        title: "Every body in the shelter changes the equation",
        detail: "Roster, traits, and staffing pressure all matter now.",
        stats: [
          ["Total", state.survivors.total],
          ["Idle", state.survivors.idle],
          ["Morale", state.resources.morale],
          ["Cap", derived.survivorCap],
        ],
      };
    case "radio":
      return {
        label: "Signal board",
        title: "The static is no longer background noise",
        detail: "Choose a signal track and force it to give up routes and truth.",
        stats: [
          ["Signal", state.story.radioProgress],
          ["Secret", state.story.secretProgress],
          ["Scans", state.stats.radioScans],
          ["Reveal", state.flags.worldReveal ? "partial" : "unknown"],
        ],
      };
    case "trade":
      return {
        label: "Market",
        title: "What the wasteland will still trade for",
        detail: "Open a channel. Buy only what solves the next pressure point.",
        stats: [
          ["Offers", state.trader.offers.length],
          ["Scrap", state.resources.scrap],
          ["Rep", state.resources.reputation],
          ["Fuel", state.resources.fuel],
        ],
      };
    case "factions":
      return {
        label: "Alignment",
        title: "Choose who gets to shape the signal",
        detail: "Permanent alignment. Real gains, real costs.",
        stats: [
          ["Aligned", state.faction.aligned || "none"],
          ["Rep", state.resources.reputation],
          ["Signal", state.story.radioProgress],
          ["Relics", state.resources.relics],
        ],
      };
    case "leaderboard": {
      const board = getLeaderboardState();
      const snapshot = getLeaderboardSnapshot(state);
      return {
        label: "Hosted board",
        title: "Measure this run against the wasteland",
        detail: "Username, hosted ranks, current score, and save transfer all live here.",
        stats: [
          ["Score", snapshot.summary.score],
          ["Stage", snapshot.summary.stage],
          ["Entries", board.entries.length || "empty"],
          ["Sync", board.enabled ? "hosted" : "offline"],
        ],
      };
    }
    case "log":
      return {
        label: "Archive",
        title: "Track what the static has already taken",
        detail: "Pulse, archive, and recent feed.",
        stats: [
          ["Entries", state.log.length],
          ["Latest", state.log[0]?.category || "general"],
          ["Night", state.log.filter((entry) => entry.category === "night").length],
          ["Radio", state.log.filter((entry) => entry.category === "radio").length],
        ],
      };
    case "help":
      return {
        label: "Field guide",
        title: "Learn the loop without drowning in text",
        detail: "Use Help when you need orientation, not constant hand-holding.",
        stats: [
          ["Guided", state.settings.tutorialHints ? "yes" : "no"],
          ["Username", state.player.username || "unset"],
          ["Routes", state.stats.expeditions],
          ["Signal", state.story.radioProgress],
        ],
      };
    case "settings":
      return {
        label: "Preferences",
        title: "Tune the run to your taste",
        detail: "Settings control onboarding, motion, stage copy, and reset safety.",
        stats: [
          ["Tutorial", state.settings.tutorialHints ? "on" : "off"],
          ["Motion", state.settings.reducedMotion ? "reduced" : "full"],
          ["Copy", state.settings.briefStageCopy ? "brief" : "full"],
          ["Reset", state.settings.confirmReset ? "confirm" : "instant"],
        ],
      };
    case "overview":
    default:
      return {
        label: "Control layer",
        title: "Everything important in one scan",
        detail: "Pressure, next action, route state, and growth in one scan.",
        stats: [
          ["Lanes", getAvailableScavengeSources(state).length],
          ["Builds", readyUpgrades.length],
          ["Signal", state.story.radioProgress],
          ["Crew", `${state.survivors.total}/${derived.survivorCap}`],
        ],
      };
  }
}

function renderTabStage(state, derived, bodyMarkup, isMobile = false) {
  const meta = tabStageMeta(state, derived);
  const visibleStats = isMobile ? meta.stats.slice(0, 2) : meta.stats;
  return `
    <div class="tab-stage tab-stage-${state.ui.activeTab}">
      <section class="stage-banner ${isMobile ? "stage-banner-mobile" : ""}">
        <div class="stage-copy">
          <span class="note-label">${meta.label}</span>
          <h2>${meta.title}</h2>
          ${isMobile
            ? `
              <details class="mobile-stage-info">
                <summary>Info</summary>
                <p class="note">${meta.detail}</p>
              </details>
            `
            : state.settings.briefStageCopy ? "" : `<p class="note">${meta.detail}</p>`}
        </div>
        <div class="stage-stat-strip">
          ${visibleStats.map(([label, value]) => `
            <div class="stage-stat">
              <span>${label}</span>
              <strong>${value}</strong>
            </div>
          `).join("")}
        </div>
      </section>
      ${renderTutorialBanner(state)}
      ${bodyMarkup}
    </div>
  `;
}


// render/tabs-primary.js
const BUILD_UPGRADE_IDS = new Set([
  "shelter_stash",
  "campfire",
  "basic_barricade",
  "food_crate",
  "crafting_bench",
  "weapon_rack",
  "armor_hooks",
  "watch_post",
  "tripwire_grid",
  "ammo_press",
  "repair_rig",
  "rain_collector",
  "water_still",
  "radio_rig",
  "battery_bank",
  "flood_lights",
  "map_board",
  "survivor_cots",
  "smokehouse",
  "trader_beacon",
  "scout_bike",
  "signal_decoder",
  "auto_scavenger",
  "faraday_mesh",
  "relay_tap",
  "bunker_drill",
]);

function upgradeDiscipline(upgrade) {
  if (BUILD_UPGRADE_IDS.has(upgrade.id)) {
    return "build";
  }
  return "craft";
}

function upgradeDisciplineLabel(upgrade) {
  return upgradeDiscipline(upgrade) === "build" ? "base build" : "fieldcraft";
}

function getUpgradeMissingNotes(state, upgrade) {
  const missing = [];

  Object.entries(upgrade.cost || {}).forEach(([resourceId, amount]) => {
    const have = state.resources[resourceId] || 0;
    if (have < amount) {
      missing.push(`${resourceLabel(resourceId)} ${have}/${amount}`);
    }
  });

  Object.entries(upgrade.materials || {}).forEach(([itemId, amount]) => {
    const have = state.inventory[itemId] || 0;
    if (have < amount) {
      missing.push(`${itemLabel(itemId)} ${have}/${amount}`);
    }
  });

  return missing;
}

function renderUpgradeQueue(state, title, ready, blocked, emptyText) {
  return `
    <div class="queue-column">
      <div class="surface-head">
        <h4>${title}</h4>
        <span class="tag">${ready.length + blocked.length}</span>
      </div>
      ${ready.length
        ? `<div class="detail-list">${ready.map((upgrade) => renderUpgradeCard(state, upgrade)).join("")}</div>`
        : ""}
      ${blocked.length
        ? `
          <div class="queue-stack">
            <span class="note-label">Need salvage</span>
            <div class="detail-list">${blocked.map((upgrade) => renderUpgradeCard(state, upgrade)).join("")}</div>
          </div>
        `
        : ""}
      ${!ready.length && !blocked.length ? `<p class="empty-state">${emptyText}</p>` : ""}
    </div>
  `;
}

function renderQuickGoals(state) {
  const sources = getAvailableScavengeSources(state);
  const hasVehicleLane = sources.some((source) => source.id === "vehicle_shells");
  const hasFoodLane = sources.some((source) => source.id === "dead_pantries");
  const goals = [
    { label: "Unlock warmth", value: state.flags.burnUnlocked ? "open" : `${Math.max(0, 3 - state.stats.searches)} searches left` },
    { label: "Open second lane", value: hasVehicleLane ? "open" : `${Math.max(0, 4 - state.stats.searches)} searches left` },
    { label: "Food lane", value: hasFoodLane ? "open" : state.upgrades.includes("food_search") ? "ready on board" : "build Simple Food Search" },
    { label: "Bank wood", value: state.resources.wood > 0 ? `${state.resources.wood} in stash` : "still looking" },
    { label: "Find sharp metal", value: hasItem(state, "sharp_metal") ? "recovered" : "rare salvage" },
  ];

  return `
    <div class="fact-grid">
      ${goals.map((goal) => `
        <div class="fact">
          <span>${goal.label}</span>
          <strong>${goal.value}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

function renderOverviewActions(state) {
  const sources = getAvailableScavengeSources(state);
  const utilityButtons = [];

  if (state.flags.burnUnlocked) {
    utilityButtons.push(actionButton({
      action: "burn-warmth",
      label: "Burn 12 scrap for warmth",
      meta: "12 scrap / immediate shelter relief",
      disabled: state.resources.scrap < 12,
      variant: "compact utility-trigger",
    }));
  }

  if (state.upgrades.includes("food_search")) {
    utilityButtons.push(actionButton({
      action: "forage-food",
      label: "Fallback food search",
      meta: "small gain, still noisy, useful when stores collapse",
      variant: "compact utility-trigger",
    }));
  }

  return `
    <div class="overview-action-shell">
      <div class="scavenge-grid ${sources.length === 1 ? "is-solo" : ""}">
        ${sources.map((source) => {
          const ceiling = sourceRarityCeiling(state, source.id);
          return `
            <div class="source-card ceiling-${ceiling.id}">
              <div class="surface-head">
                <div>
                  <span class="note-label">Scavenge lane</span>
                  <h4>${source.label}</h4>
                </div>
                <span class="tag">${sourceRunCount(state, source.id)} runs</span>
              </div>
              <p class="note">${source.detail}</p>
              <div class="lane-metrics">
                <div><span>Travel</span><strong>${source.hours}h</strong></div>
                <div><span>Lead</span><strong>${source.tags[1] || source.tags[0] || "salvage"}</strong></div>
              </div>
              <div class="chip-row">${tagList([...source.tags, `ceiling ${ceiling.label}`])}</div>
              <div class="chip-row">${tagList(source.focus)}</div>
              ${actionButton({
                action: source.id === "rubble" ? "search-rubble" : "search-source",
                label: source.label,
                meta: `${source.hours}h / ${source.tags[1] || "salvage lane"}`,
                variant: source.id === "rubble" ? "primary source-trigger" : "source-trigger",
                data: source.id === "rubble" ? {} : { source: source.id },
              })}
            </div>
          `;
        }).join("")}
      </div>
      ${utilityButtons.length ? `<div class="overview-utility-row">${utilityButtons.join("")}</div>` : ""}
    </div>
  `;
}

function renderUpgradeCard(state, upgrade) {
  const built = state.upgrades.includes(upgrade.id);
  const ready = canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials);
  const discipline = upgradeDisciplineLabel(upgrade);
  const meta = [];
  const missing = getUpgradeMissingNotes(state, upgrade);

  meta.push(discipline);
  if (Object.keys(upgrade.cost || {}).length) {
    meta.push(formatCost(upgrade.cost));
  }
  if (upgrade.materials && Object.keys(upgrade.materials).length) {
    meta.push(Object.entries(upgrade.materials).map(([itemId, amount]) => `${ITEMS[itemId]?.name || itemId} x${amount}`).join(" / "));
  }

  return `
    <div class="list-block upgrade-card ${built ? "is-built-upgrade" : ready ? "is-ready-upgrade" : "is-blocked-upgrade"}">
      <div class="surface-head">
        <h4>${upgrade.name}</h4>
        <span class="tag">${built ? "built" : ready ? "ready" : "blocked"}</span>
      </div>
      <p class="note">${upgrade.description}</p>
      ${meta.length ? `<div class="chip-row">${tagList(meta)}</div>` : ""}
      ${!built && missing.length ? `<div class="chip-row">${tagList(missing)}</div>` : ""}
      ${built ? "" : actionButton({
        action: "buy-upgrade",
        label: `${upgrade.verb || "Build"} ${upgrade.name}`,
        meta: ready ? "Permanent unlock" : "Need salvage or tools",
        disabled: !ready,
        data: { upgrade: upgrade.id },
      })}
    </div>
  `;
}

function renderOverviewTab(state, derived, _isMobile = false) {
  const availableUpgrades = getVisibleUpgrades(state).filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const availableSources = getAvailableScavengeSources(state);
  const lockedSources = SCAVENGE_SOURCES.filter((source) => !availableSources.some((entry) => entry.id === source.id)).slice(0, 3);
  const sections = [
    surfaceCard({
      title: "Operations desk",
      meta: `${getNightForecast(state).severity}`,
      className: "span-12",
      body: renderCommandDesk(state, derived, availableSources, availableUpgrades),
    }),
    surfaceCard({
      title: "Scavenge board",
      meta: `${availableSources.length} lanes`,
      className: "span-8",
      body: `${renderOverviewActions(state)}${!state.unlockedSections.includes("upgrades") ? `<div class="spacer-top">${renderQuickGoals(state)}</div>` : ""}`,
    }),
    surfaceCard({
      title: "What the static remembers",
      meta: `${Math.min(5, state.log.length)} recent`,
      className: "span-4",
      body: renderMiniLog(state.log, 5),
    }),
  ];

  if (state.ui.notableFind) {
    sections.unshift(surfaceCard({
      title: "Notable find",
      meta: `${RARITY_DEFS[state.ui.notableFind.rarity]?.label || state.ui.notableFind.rarity}`,
      className: "span-12",
      body: `
        <div class="feature-find">
          <div>
            <span class="note-label">Recovered from</span>
            <h3>${state.ui.notableFind.label}</h3>
            <p class="note">${state.ui.notableFind.sourceLabel} paid out on ${state.ui.notableFind.stamp}.</p>
          </div>
          <div class="chip-row">${tagList([
            `${state.ui.notableFind.amount} recovered`,
            RARITY_DEFS[state.ui.notableFind.rarity]?.hint || "notable salvage",
          ])}</div>
        </div>
      `,
    }));
  }

  if (state.unlockedSections.includes("upgrades")) {
    sections.push(surfaceCard({
      title: "Lane intel",
      meta: `${availableSources.length} active / ${lockedSources.length} pending`,
      className: "span-7",
      body: `
        <div class="detail-list">
          ${availableSources.map((source) => `
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>${source.label}</h4>
                <span class="tag">${sourceRarityCeiling(state, source.id).label}</span>
              </div>
              <p class="note">${source.description}</p>
              <div class="chip-row">${tagList(source.focus)}</div>
            </div>
          `).join("")}
          ${lockedSources.length ? lockedSources.map((source) => `
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>${source.label}</h4>
                <span class="tag">locked</span>
              </div>
              <p class="note">${describeSourceUnlock(state, source)}</p>
            </div>
          `).join("") : ""}
        </div>
      `,
    }));
    sections.push(surfaceCard({
      title: "Ready to build",
      meta: `${availableUpgrades.length} open`,
      className: "span-5",
      body: availableUpgrades.length
        ? `<div class="detail-list">${availableUpgrades.slice(0, 4).map((upgrade) => renderUpgradeCard(state, upgrade)).join("")}</div>`
        : `<p class="empty-state">Nothing new is ready. Push the city harder.</p>`,
    }));
  }

  return `<div class="tab-grid tab-grid-overview">${sections.join("")}</div>`;
}

function renderCraftTab(state, isMobile = false) {
  const visibleUpgrades = getVisibleUpgrades(state);
  const available = visibleUpgrades.filter((upgrade) => !state.upgrades.includes(upgrade.id));
  const buildUpgrades = available.filter((upgrade) => upgradeDiscipline(upgrade) === "build");
  const craftUpgrades = available.filter((upgrade) => upgradeDiscipline(upgrade) === "craft");
  const readyBuilds = buildUpgrades.filter((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials));
  const blockedBuilds = buildUpgrades.filter((upgrade) => !readyBuilds.includes(upgrade));
  const readyCrafts = craftUpgrades.filter((upgrade) => canAfford(state, upgrade.cost) && hasMaterials(state, upgrade.materials));
  const blockedCrafts = craftUpgrades.filter((upgrade) => !readyCrafts.includes(upgrade));
  const built = state.upgrades
    .map((upgradeId) => visibleUpgrades.find((upgrade) => upgrade.id === upgradeId))
    .filter(Boolean);
  const builtBuilds = built.filter((upgrade) => upgradeDiscipline(upgrade) === "build");
  const builtCrafts = built.filter((upgrade) => upgradeDiscipline(upgrade) === "craft");

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-craft">
        ${surfaceCard({
          title: "Base builds",
          meta: `${readyBuilds.length} ready / ${blockedBuilds.length} blocked`,
          body: `
            <details class="mobile-accordion" open>
              <summary>Open build queue</summary>
              <div class="mobile-accordion-body">
                ${renderUpgradeQueue(state, "Shelter works", readyBuilds, blockedBuilds, "No base structures are open yet.")}
              </div>
            </details>
          `,
        })}
        ${surfaceCard({
          title: "Fieldcraft",
          meta: `${readyCrafts.length} ready / ${blockedCrafts.length} blocked`,
          body: `
            <details class="mobile-accordion" open>
              <summary>Open fieldcraft queue</summary>
              <div class="mobile-accordion-body">
                ${renderUpgradeQueue(state, "Tools and fieldwork", readyCrafts, blockedCrafts, "No fieldcraft jobs are open yet.")}
              </div>
            </details>
          `,
        })}
        ${surfaceCard({
          title: "Systems online",
          meta: `${built.length} total`,
          body: built.length
            ? `
              <details class="mobile-accordion">
                <summary>Show installed systems</summary>
                <div class="detail-list">${built.map((upgrade) => `
                  <div class="list-block compact-block">
                    <div class="surface-head">
                      <h4>${upgrade.name}</h4>
                      <span class="tag">live</span>
                    </div>
                    <div class="chip-row">${tagList([upgradeDisciplineLabel(upgrade), "installed"])}</div>
                  </div>
                `).join("")}</div>
              </details>
            `
            : `<p class="empty-state">No installed systems yet.</p>`,
        })}
      </div>
    `;
  }

  return `
    <div class="tab-grid">
      ${surfaceCard({
        title: "Build + craft board",
        meta: `${available.length} open`,
        className: "span-8",
        body: available.length
          ? `
            <div class="queue-board">
              ${renderUpgradeQueue(state, "Base builds", readyBuilds, blockedBuilds, "No base structures are open yet.")}
              ${renderUpgradeQueue(state, "Fieldcraft", readyCrafts, blockedCrafts, "No fieldcraft jobs are open yet.")}
            </div>
          `
          : `<p class="empty-state">No fresh plans yet. Search deeper.</p>`,
      })}
      ${surfaceCard({
        title: "Systems online",
        meta: `${built.length} total`,
        className: "span-4",
        body: built.length
          ? `
            <div class="detail-list">
              <div class="list-block compact-block">
                <div class="surface-head">
                  <h4>Base builds</h4>
                  <span class="tag">${builtBuilds.length}</span>
                </div>
                ${builtBuilds.length
                  ? `<div class="chip-row">${tagList(builtBuilds.map((upgrade) => upgrade.name))}</div>`
                  : `<p class="empty-state">No base systems live.</p>`}
              </div>
              <div class="list-block compact-block">
                <div class="surface-head">
                  <h4>Fieldcraft</h4>
                  <span class="tag">${builtCrafts.length}</span>
                </div>
                ${builtCrafts.length
                  ? `<div class="chip-row">${tagList(builtCrafts.map((upgrade) => upgrade.name))}</div>`
                  : `<p class="empty-state">No crafted tools online.</p>`}
              </div>
            </div>
          `
          : `<p class="empty-state">You still live hand-to-mouth.</p>`,
      })}
      ${surfaceCard({
        title: "Rarity lanes",
        meta: "loot by source",
        className: "span-12",
        body: lootBandMarkup(state),
      })}
    </div>
  `;
}

function renderInventoryTab(state, derived, _isMobile = false) {
  const items = Object.entries(state.inventory)
    .filter(([itemId, amount]) => amount > 0 && ITEMS[itemId])
    .sort((left, right) => {
      const leftItem = ITEMS[left[0]];
      const rightItem = ITEMS[right[0]];
      return `${leftItem.type}-${leftItem.name}`.localeCompare(`${rightItem.type}-${rightItem.name}`);
    });

  const weaponName = state.equipped.weapon ? ITEMS[state.equipped.weapon]?.name : "Bare hands";
  const armorName = state.equipped.armor ? ITEMS[state.equipped.armor]?.name : "Street clothes";
  const gearItems = items.filter(([itemId]) => ["weapon", "armor"].includes(ITEMS[itemId].type));
  const fieldItems = items.filter(([itemId]) => ITEMS[itemId].type === "consumable");
  const oddItems = items.filter(([itemId]) => !["weapon", "armor", "consumable"].includes(ITEMS[itemId].type));
  const resourceGroups = ["core", "common", "uncommon", "rare", "social", "mythic"]
    .map((tier) => {
      const entries = state.discoveredResources
        .filter((resourceId) => RESOURCE_DEFS[resourceId]?.tier === tier)
        .sort((left, right) => RESOURCE_ORDER.indexOf(left) - RESOURCE_ORDER.indexOf(right));
      if (!entries.length) {
        return "";
      }
      return `
        <div class="list-block">
          <div class="surface-head">
            <h4>${tier}</h4>
            <span class="tag">${entries.length}</span>
          </div>
          <div class="chip-row">
            ${tagList(entries.map((resourceId) => `${resourceLabel(resourceId)} ${state.resources[resourceId]}`))}
          </div>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  return `
    <div class="tab-grid tab-grid-tight">
      ${surfaceCard({
        title: "Stores by tier",
        meta: `${state.discoveredResources.length} tracked`,
        className: "span-12",
        body: resourceGroups
          ? `<div class="resource-tier-grid">${resourceGroups}</div>`
          : `<p class="empty-state">Only scrap has a name so far.</p>`,
      })}
      ${surfaceCard({
        title: "Field loadout",
        meta: `attack ${derived.attack} / defense ${derived.defense}`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Weapon</span><strong>${weaponName}</strong></div>
            <div class="fact"><span>Armor</span><strong>${armorName}</strong></div>
            <div class="fact"><span>Items</span><strong>${items.length}</strong></div>
            <div class="fact"><span>Ammo</span><strong>${state.resources.ammo}</strong></div>
          </div>
        `,
      })}
      ${surfaceCard({
        title: "Gear locker",
        meta: `${gearItems.length} ready`,
        className: "span-4",
        body: gearItems.length
          ? `<div class="inventory-card-grid">${gearItems.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount)).join("")}</div>`
          : `<p class="empty-state">No dedicated weapons or armor stored yet.</p>`,
      })}
      ${surfaceCard({
        title: "Field kit",
        meta: `${fieldItems.length} usable`,
        className: "span-4",
        body: fieldItems.length
          ? `<div class="inventory-card-grid">${fieldItems.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount)).join("")}</div>`
          : `<p class="empty-state">No consumables packed right now.</p>`,
      })}
      ${surfaceCard({
        title: "Odd salvage",
        meta: `${oddItems.length} pieces`,
        className: "span-12",
        body: oddItems.length
          ? `<div class="inventory-card-grid">${oddItems.map(([itemId, amount]) => renderInventoryItemCard(itemId, amount)).join("")}</div>`
          : `<p class="empty-state">Nothing unusual is taking up space yet.</p>`,
      })}
    </div>
  `;
}

function renderNightPlanner(state) {
  const forecast = getNightForecast(state);
  const systems = forecast.systems;
  const report = state.night.lastReport;
  const planButtons = Object.values(NIGHT_PLANS).map((plan) => actionButton({
    action: "set-night-plan",
    label: plan.label,
    meta: plan.description,
    disabled: state.night.plan === plan.id,
    data: { plan: plan.id },
    variant: `compact ${state.night.plan === plan.id ? "primary" : ""}`,
  }));

  return `
    <div class="detail-list">
      <div class="fact-grid">
        <div class="fact"><span>Forecast</span><strong>${forecast.severity}</strong></div>
        <div class="fact"><span>Night in</span><strong>${forecast.hoursUntilNight}h</strong></div>
        <div class="fact"><span>Siege</span><strong>${Math.round(forecast.siegeChance * 100)}%</strong></div>
        <div class="fact"><span>Infected</span><strong>${Math.round(forecast.infectedChance * 100)}%</strong></div>
        <div class="fact"><span>Raid</span><strong>${Math.round(forecast.raidChance * 100)}%</strong></div>
        <div class="fact"><span>Breach</span><strong>${Math.round(forecast.breachChance * 100)}%</strong></div>
        <div class="fact"><span>Plan</span><strong>${forecast.plan.label}</strong></div>
        <div class="fact"><span>Coverage</span><strong>${systems.coverage.toFixed(1)}</strong></div>
      </div>
      <div class="chip-row">${tagList([
        `power ${systems.powerState}`,
        `maintenance ${systems.maintenanceState}`,
        `siege pressure ${state.night.siegePressure}`,
      ])}</div>
      <div class="action-stack">${planButtons.join("")}</div>
      ${report ? `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>Last night</h4>
            <span class="tag">${report.eventType}</span>
          </div>
          <p class="note">${report.summary}</p>
          ${report.damagedStructures?.length ? `<div class="chip-row">${tagList(report.damagedStructures.map((target) => structureByKey(target).label || target))}</div>` : ""}
          ${report.crewHits?.length ? `<div class="chip-row">${tagList(report.crewHits)}</div>` : ""}
        </div>
      ` : `<p class="empty-state">No night report yet.</p>`}
    </div>
  `;
}

function renderExpeditionPlanner(state) {
  const selectedZoneId = state.expedition.selectedZone || null;
  const preview = selectedZoneId ? getExpeditionPreview(state, selectedZoneId, state.expedition.approach) : null;

  if (!preview) {
    return `<p class="empty-state">Prepare a zone route to choose an approach and launch clean.</p>`;
  }

  return `
    <div class="detail-list">
      <div class="list-block compact-block">
        <div class="surface-head">
          <div>
            <span class="note-label">Prepared zone</span>
            <h4>${preview.zone.name}</h4>
          </div>
          <span class="tag">${preview.approach.label}</span>
        </div>
        <p class="note">${preview.objective.label} objective via ${preview.approach.label.toLowerCase()} route.</p>
        <div class="fact-grid">
          <div class="fact"><span>Travel</span><strong>${preview.hours}h</strong></div>
          <div class="fact"><span>Encounter</span><strong>${Math.round(preview.encounterChance * 100)}%</strong></div>
          <div class="fact"><span>Loot bias</span><strong>${preview.lootBonus >= 0 ? "+" : ""}${Math.round(preview.lootBonus * 100)}%</strong></div>
          <div class="fact"><span>Noise</span><strong>${preview.noise.toFixed(1)}</strong></div>
        </div>
        ${state.expedition.lastRouteEvent ? `<div class="chip-row">${tagList([
          `last route event: ${state.expedition.lastRouteEvent.label}`,
          state.expedition.lastRouteEvent.stamp,
        ])}</div>` : ""}
        <div class="chip-row">${tagList([
          preview.objective.short,
          ...(Object.keys(preview.cost).length ? [formatCost(preview.cost)] : ["No prep cost"]),
        ])}</div>
      </div>
      <div class="approach-grid objective-grid">
        ${EXPEDITION_OBJECTIVES.map((objective) => {
          const objectivePreview = getExpeditionPreview(state, selectedZoneId, state.expedition.approach, objective.id);
          return `
            <div class="list-block compact-block ${state.expedition.objective === objective.id ? "is-selected-plan" : ""}">
              <div class="surface-head">
                <h4>${objective.label}</h4>
                <span class="tag">${objective.short}</span>
              </div>
              <div class="compact-fact-grid">
                <div><span>Travel</span><strong>${objectivePreview.hours}h</strong></div>
                <div><span>Encounter</span><strong>${Math.round(objectivePreview.encounterChance * 100)}%</strong></div>
                <div><span>Noise</span><strong>${objectivePreview.noise.toFixed(1)}</strong></div>
                <div><span>Bias</span><strong>${objective.tags[0]}</strong></div>
              </div>
              <div class="chip-row">${tagList([
                ...objective.tags,
                objective.traceGain ? "trace gain" : "",
                objective.combatBonus ? "combat edge" : "",
              ].filter(Boolean))}</div>
              ${actionButton({
                action: "set-objective",
                label: objective.label,
                meta: "objective",
                disabled: state.expedition.objective === objective.id,
                data: { objective: objective.id },
                variant: "compact",
              })}
            </div>
          `;
        }).join("")}
      </div>
      <div class="approach-grid">
        ${EXPEDITION_APPROACHES.map((approach) => {
          const approachPreview = getExpeditionPreview(state, selectedZoneId, approach.id);
          return `
            <div class="list-block compact-block ${state.expedition.approach === approach.id ? "is-selected-plan" : ""}">
              <div class="surface-head">
                <h4>${approach.label}</h4>
                <span class="tag">${approach.short}</span>
              </div>
              <div class="compact-fact-grid">
                <div><span>Travel</span><strong>${approachPreview.hours}h</strong></div>
                <div><span>Encounter</span><strong>${Math.round(approachPreview.encounterChance * 100)}%</strong></div>
                <div><span>Noise</span><strong>${approachPreview.noise.toFixed(1)}</strong></div>
                <div><span>Prep</span><strong>${Object.keys(approach.cost).length ? "supply" : "none"}</strong></div>
              </div>
              <div class="chip-row">${tagList([
                approach.short,
                Object.keys(approach.cost).length ? formatCost(approach.cost) : "no extra cost",
                approach.travelEventChance >= 0.5 ? "more route events" : "lighter route variance",
              ])}</div>
              ${actionButton({
                action: "set-approach",
                label: approach.label,
                meta: "route mode",
                disabled: state.expedition.approach === approach.id,
                data: { approach: approach.id },
                variant: "compact",
              })}
            </div>
          `;
        }).join("")}
      </div>
      ${actionButton({
        action: "launch-prepared",
        label: `Launch ${preview.zone.name}`,
        meta: preview.canLaunch ? "prepared route" : `need ${formatCost(preview.cost)}`,
        disabled: !preview.canLaunch || Boolean(state.combat),
        variant: "primary",
      })}
      ${state.expedition.lastOutcome ? `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>Last route result</h4>
            <span class="tag">${state.expedition.lastOutcome.stamp}</span>
          </div>
          <div class="chip-row">${tagList([
            state.expedition.lastOutcome.routeEventId ? `event ${state.expedition.lastOutcome.routeEventId}` : "clean route",
            `encounter ${Math.round(state.expedition.lastOutcome.encounterChance * 100)}%`,
            `loot ${state.expedition.lastOutcome.lootBonus >= 0 ? "+" : ""}${Math.round(state.expedition.lastOutcome.lootBonus * 100)}%`,
          ])}</div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderShelterTab(state, derived, isMobile = false) {
  const upkeep = getShelterUpkeep(state);
  const systems = getShelterSystems(state, derived);
  const actions = [
    actionButton({
      action: "eat-ration",
      label: "Eat 1 food",
      meta: "Reset your hunger clock and steady yourself.",
      disabled: state.resources.food < 1,
    }),
    actionButton({
      action: "drink-water",
      label: "Drink 1 drinkable water",
      meta: "Reset thirst and steady yourself.",
      disabled: state.resources.water < 1,
    }),
    actionButton({
      action: "patch-barricade",
      label: "Patch barricade line",
      meta: "6 scrap / 2 wood / steadier fence",
      disabled: state.resources.scrap < 6 || state.resources.wood < 2,
    }),
  ];

  if (state.upgrades.includes("ammo_press")) {
    actions.push(actionButton({
      action: "craft-ammo",
      label: "Press ammo",
      meta: "Spend parts, scrap, and chemicals for 5 rounds.",
      disabled: state.resources.parts < 1 || state.resources.scrap < 1 || state.resources.chemicals < 1,
    }));
  }

  const passive = Object.entries(derived.passive)
    .filter(([, rate]) => rate > 0)
    .map(([resourceId, rate]) => `${resourceLabel(resourceId)} +${rate.toFixed(2)}/s`);
  const activeEdges = [
    derived.salvageYieldBonus > 0 ? `salvage +${Math.round(derived.salvageYieldBonus * 100)}%` : "",
    derived.forageYieldBonus > 0 ? `forage +${Math.round(derived.forageYieldBonus * 100)}%` : "",
    derived.signalGain > 0 ? `signal +${derived.signalGain.toFixed(2)}` : "",
    derived.nightMitigation > 0 ? `night shield ${derived.nightMitigation.toFixed(1)}` : "",
    derived.siegeMitigation > 0 ? `siege guard ${derived.siegeMitigation.toFixed(1)}` : "",
    derived.repairPower > 0 ? `repair ${derived.repairPower.toFixed(1)}` : "",
  ].filter(Boolean);
  const perimeter = getShelterMapPerimeter(state);
  const liveStructures = getBuiltShelterStructures(state).map((structure) => structure.label);
  if (perimeter) {
    liveStructures.unshift(perimeter.label);
  }
  const liveAnnexes = SHELTER_MAP_ANNEXES
    .filter((entry) => state.upgrades.includes(entry.upgrade))
    .map((entry) => entry.label);
  const mapGuidance = isMobile
    ? "Use the Map mode above for structure checks and repairs."
    : "Use <strong>Shelter Map</strong> for damage and structure checks.";

  const opsMarkup = `
    <div class="tab-grid tab-grid-tight">
      ${surfaceCard({
        title: "Shelter state",
        meta: `defense ${derived.defense}`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Warmth</span><strong>${state.shelter.warmth.toFixed(1)}</strong></div>
            <div class="fact"><span>Threat</span><strong>${state.shelter.threat.toFixed(1)}</strong></div>
            <div class="fact"><span>Noise</span><strong>${state.shelter.noise.toFixed(1)}</strong></div>
            <div class="fact"><span>Defense</span><strong>${derived.defense}</strong></div>
            <div class="fact"><span>Morale</span><strong>${state.resources.morale}</strong></div>
            <div class="fact"><span>Food</span><strong>${state.resources.food}</strong></div>
            <div class="fact"><span>Water</span><strong>${state.resources.water}</strong></div>
            <div class="fact"><span>Wood</span><strong>${state.resources.wood}</strong></div>
          </div>
        `,
      })}
      ${surfaceCard({
        title: "Shelter flow",
        meta: `${upkeep.crew} crew / live upkeep`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Meal cycle</span><strong>${upkeep.mealCost} / ${upkeep.mealHours}h</strong></div>
            <div class="fact"><span>Water cycle</span><strong>${upkeep.waterCost} / ${upkeep.waterHours}h</strong></div>
            <div class="fact"><span>Meal due</span><strong>${upkeep.mealHoursLeft}h</strong></div>
            <div class="fact"><span>Water due</span><strong>${upkeep.waterHoursLeft}h</strong></div>
            <div class="fact"><span>Crew</span><strong>${upkeep.crew}</strong></div>
            <div class="fact"><span>Beds</span><strong>${derived.survivorCap}</strong></div>
          </div>
          <div class="chip-row">${tagList([
            `${upkeep.mealCost} food every ${upkeep.mealHours}h`,
            `${upkeep.waterCost} water every ${upkeep.waterHours}h`,
            upkeep.maintenanceWood || upkeep.maintenanceParts
              ? `${upkeep.maintenanceWood} wood${upkeep.maintenanceParts ? ` / ${upkeep.maintenanceParts} parts` : ""} every ${upkeep.maintenanceHours}h`
              : "maintenance light",
          ])}</div>
        `,
      })}
      ${surfaceCard({
        title: "Base systems",
        meta: `${systems.maintenanceState} / ${systems.powerState}`,
        className: "span-4",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Power</span><strong>${systems.powerSupply}/${systems.powerDemand}</strong></div>
            <div class="fact"><span>Coverage</span><strong>${systems.coverage.toFixed(1)}</strong></div>
            <div class="fact"><span>Maintenance</span><strong>${systems.maintenanceSupport.toFixed(1)}</strong></div>
            <div class="fact"><span>Load</span><strong>${systems.maintenanceLoad.toFixed(1)}</strong></div>
            <div class="fact"><span>Food flow</span><strong>${systems.foodFlow >= 0 ? "+" : ""}${systems.foodFlow.toFixed(2)}</strong></div>
            <div class="fact"><span>Water flow</span><strong>${systems.waterFlow >= 0 ? "+" : ""}${systems.waterFlow.toFixed(2)}</strong></div>
          </div>
          <div class="chip-row">${tagList([
            `power ${systems.powerState}`,
            `maintenance ${systems.maintenanceState}`,
            ...systems.adjacency.map((entry) => entry.label),
          ])}</div>
        `,
      })}
      ${surfaceCard({
        title: "Night line",
        meta: `${getNightForecast(state).severity}`,
        className: "span-4",
        body: renderNightPlanner(state),
      })}
      ${surfaceCard({
        title: "Survival actions",
        meta: "manual control",
        className: "span-4",
        body: `<div class="action-stack">${actions.join("")}</div>`,
      })}
      ${surfaceCard({
        title: "Built shelter systems",
        meta: `${liveStructures.length + liveAnnexes.length} live`,
        className: "span-4",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>Structures</h4>
                <span class="tag">${liveStructures.length}</span>
              </div>
              ${liveStructures.length ? `<div class="chip-row">${tagList(liveStructures)}</div>` : `<p class="empty-state">Still mostly one room.</p>`}
            </div>
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>Annexes</h4>
                <span class="tag">${liveAnnexes.length}</span>
              </div>
              ${liveAnnexes.length ? `<div class="chip-row">${tagList(liveAnnexes)}</div>` : `<p class="empty-state">No annexes attached.</p>`}
            </div>
          </div>
        `,
      })}
      ${surfaceCard({
        title: "Support edges",
        meta: activeEdges.length ? `${activeEdges.length} active` : "manual only",
        className: "span-4",
        body: `
          ${activeEdges.length ? `<div class="chip-row">${tagList(activeEdges)}</div>` : `<p class="empty-state">Most gains still come from decisions, not automation.</p>`}
          ${passive.length ? `<div class="chip-row">${tagList(passive)}</div>` : ""}
        `,
      })}
      ${surfaceCard({
        title: "Pressure notes",
        meta: `${getOutpostStage(liveStructures.length)}`,
        className: "span-4",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <p class="note">Warmth falls. Threat rises. Noise paints a target on the fence. Crew eats, drinks, and now drags maintenance behind them if the base outgrows its repair line.</p>
            </div>
            <div class="list-block compact-block">
              <p class="note">${mapGuidance}</p>
            </div>
            <div class="list-block compact-block">
              <p class="note">Power gaps darken signal tools. Weak maintenance means damage snowballs into worse nights.</p>
            </div>
          </div>
        `,
      })}
    </div>
  `;

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-shelter">
        <div class="mobile-segmented-control">
          <button
            type="button"
            class="mobile-segment ${state.ui.mobileShelterMode !== "map" ? "is-active" : ""}"
            data-action="set-mobile-shelter-mode"
            data-mode="ops"
          >
            Ops
          </button>
          <button
            type="button"
            class="mobile-segment ${state.ui.mobileShelterMode === "map" ? "is-active" : ""}"
            data-action="set-mobile-shelter-mode"
            data-mode="map"
          >
            Map
          </button>
        </div>
        ${state.ui.mobileShelterMode === "map"
          ? renderShelterMapMobilePanel(state)
          : opsMarkup}
      </div>
    `;
  }

  return opsMarkup;
}

function renderMapTab(state, _isMobile = false) {
  const zones = ZONES.filter((zone) => state.unlockedZones.includes(zone.id));
  const preview = state.expedition.selectedZone
    ? getExpeditionPreview(state, state.expedition.selectedZone, state.expedition.approach, state.expedition.objective)
    : null;
  return `
    <div class="tab-grid">
      ${surfaceCard({
        title: "Route planner",
        meta: state.expedition.selectedZone ? "prepared" : "idle",
        className: "span-12 route-command",
        body: renderExpeditionPlanner(state),
      })}
      ${preview ? surfaceCard({
        title: "Route pressure",
        meta: preview.zone.name,
        className: "span-12",
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Objective</span><strong>${preview.objective.label}</strong></div>
            <div class="fact"><span>Approach</span><strong>${preview.approach.label}</strong></div>
            <div class="fact"><span>Travel</span><strong>${preview.hours}h</strong></div>
            <div class="fact"><span>Encounter</span><strong>${Math.round(preview.encounterChance * 100)}%</strong></div>
            <div class="fact"><span>Threat</span><strong>${preview.threat.toFixed(1)}</strong></div>
            <div class="fact"><span>Noise</span><strong>${preview.noise.toFixed(1)}</strong></div>
          </div>
          <div class="chip-row">${tagList([
            ...preview.objective.tags,
            preview.approach.travelEventChance >= 0.5 ? "route likely to swing" : "route more stable",
          ])}</div>
          ${state.expedition.lastRouteEvent ? `<p class="note">Last route event: ${state.expedition.lastRouteEvent.text}</p>` : ""}
        `,
      }) : ""}
      ${zones.length ? zones.map((zone) => surfaceCard({
        title: zone.name,
        meta: state.expedition.selectedZone === zone.id ? `selected / risk ${zone.risk}` : `risk ${zone.risk}`,
        className: `span-4 zone-card ${state.expedition.selectedZone === zone.id ? "is-selected-route" : ""}`,
        body: `
          <p class="note">${zone.description}</p>
          <div class="fact-grid zone-fact-grid">
            <div class="fact"><span>Travel</span><strong>${zone.hours}h</strong></div>
            <div class="fact"><span>Encounter</span><strong>${Math.round(zone.encounterChance * 100)}%</strong></div>
          </div>
          <div class="chip-row">
            ${tagList([
              state.visitedZones.includes(zone.id) ? "visited" : "new route",
              zone.risk,
            ])}
          </div>
          <div class="chip-row">
            ${tagList(Object.entries(zone.loot)
              .filter(([, range]) => range[1] > 0)
              .map(([resourceId, range]) => `${resourceLabel(resourceId)} ${range[0]}-${range[1]}`))}
          </div>
            ${zone.itemPool?.length ? `<div class="chip-row">${tagList(zone.itemPool.map((itemId) => itemLabel(itemId)))}</div>` : ""}
          ${actionButton({
            action: "prepare-zone",
            label: `Prepare ${zone.name}`,
            meta: state.expedition.selectedZone === zone.id ? "selected for planner" : "route planning",
            disabled: Boolean(state.combat),
            data: { zone: zone.id },
          })}
        `,
      })).join("") : surfaceCard({
        title: "Map board",
        meta: "blank",
        className: "span-8",
        body: `<p class="empty-state">No routes marked yet.</p>`,
      })}
    </div>
  `;
}


// render/tabs-secondary.js
function accordionSection(title, meta, body, open = false) {
  return `
    <details class="mobile-accordion"${open ? " open" : ""}>
      <summary>
        <span>${title}</span>
        ${meta ? `<span class="tag">${meta}</span>` : ""}
      </summary>
      <div class="mobile-accordion-body">${body}</div>
    </details>
  `;
}

const PATCH_NOTES = [
  {
    version: "v5.1",
    title: "Base Pressure Overhaul",
    points: [
      "Siege pressure, breach escalation, and deeper night reports added.",
      "Base systems now track power, coverage, maintenance, food flow, and water flow.",
      "Expeditions can trigger authored route events with stronger risk and payoff swings.",
      "New tool and weapon tiers push repair, signal, and defense progression forward.",
      "Survivors now carry wounds and stress that affect the run.",
    ],
  },
  {
    version: "v5.0",
    title: "Survival Foundation Overhaul",
    points: [
      "Day 1 scavenging is louder and more dangerous.",
      "Wood is now a real shelter material.",
      "Crew consumes food and drinkable water on upkeep cycles.",
      "Build and Fieldcraft are split on the board.",
      "Trade and Factions stay parked while survival is tightened.",
    ],
  },
  {
    version: "v4.x",
    title: "UI and Shelter Passes",
    points: [
      "Desktop and mobile shells were rebuilt for cleaner control.",
      "Shelter map switched to fixed grid positions.",
      "Leaderboard, save transfer, and username flow were added.",
    ],
  },
];

function renderPatchNotes() {
  return `
    <div class="detail-list patch-note-list">
      ${PATCH_NOTES.map((note) => `
        <div class="list-block compact-block">
          <div class="surface-head">
            <h4>${note.title}</h4>
            <span class="tag">${note.version}</span>
          </div>
          <div class="chip-row">${tagList(note.points)}</div>
        </div>
      `).join("")}
    </div>
  `;
}


function leaderboardStatusLabel(board) {
  if (!board.enabled) {
    return "offline";
  }
  if (board.status === "loading") {
    return "syncing";
  }
  if (board.status === "error") {
    return "issue";
  }
  if (board.submitStatus === "submitting") {
    return "uploading";
  }
  return "synced";
}

function leaderboardStatusMessage(board) {
  if (board.message) {
    return board.message;
  }
  if (!board.enabled) {
    return "Hosted leaderboard is disabled for this build.";
  }
  if (!board.entries.length) {
    return "No hosted runs yet. Submit the first one.";
  }
  return board.lastUpdated
    ? `Board synced. Updated ${board.lastUpdated}.`
    : "Board synced and waiting for the next run.";
}

function leaderboardEntriesMarkup(entries) {
  if (!entries.length) {
    return '<p class="empty-state">No hosted runs yet. Submit the first one.</p>';
  }

  return `
    <div class="detail-list leaderboard-stack">
      ${entries.map((entry) => `
        <div class="list-block compact-block leaderboard-row">
          <div class="surface-head">
            <h4>#${entry.rank} ${entry.playerName}</h4>
            <span class="tag">${entry.score}</span>
          </div>
          <div class="chip-row">${tagList([
            entry.stage,
            `nights ${entry.nights}`,
            `zones ${entry.zones}`,
            `signal ${entry.radio}`,
          ])}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function leaderboardRunSummary(snapshot, username) {
  return `
    <div class="fact-grid">
      <div class="fact"><span>Username</span><strong>${username || "unset"}</strong></div>
      <div class="fact"><span>Score</span><strong>${snapshot.summary.score}</strong></div>
      <div class="fact"><span>Stage</span><strong>${snapshot.summary.stage}</strong></div>
      <div class="fact"><span>Nights</span><strong>${snapshot.summary.nightsSurvived}</strong></div>
      <div class="fact"><span>Zones</span><strong>${snapshot.summary.zonesVisited}</strong></div>
      <div class="fact"><span>Signal</span><strong>${snapshot.summary.radioProgress}</strong></div>
    </div>
  `;
}

function renderSurvivorTab(state, derived, _isMobile = false) {
  const roster = [...state.survivors.roster].sort((left, right) => {
    const leftRole = left.role === "idle" ? "zz-idle" : left.role;
    const rightRole = right.role === "idle" ? "zz-idle" : right.role;
    return `${leftRole}-${left.name}`.localeCompare(`${rightRole}-${right.name}`);
  });
  const woundedCount = roster.filter((survivor) => survivor.wounded > 0).length;
  const stressedCount = roster.filter((survivor) => survivor.stress >= 4).length;
  return renderSplitPane(
    [
      surfaceCard({
        title: "Assignment board",
        meta: "roles",
        body: `
          <div class="detail-list">
            ${Object.entries(SURVIVOR_ROLES).map(([roleId, role]) => `
              <div class="list-block">
                <div class="surface-head">
                  <h4>${role.label}</h4>
                  <span class="tag">${state.survivors.assigned[roleId]}</span>
                </div>
                <p class="note">${role.description}</p>
                <div class="action-row">
                  <button type="button" class="mini-button" data-action="adjust-role" data-role="${roleId}" data-delta="-1" ${state.survivors.assigned[roleId] < 1 ? "disabled" : ""}>-</button>
                  <button type="button" class="mini-button" data-action="adjust-role" data-role="${roleId}" data-delta="1" ${state.survivors.idle < 1 ? "disabled" : ""}>+</button>
                  <span class="chip">idle ${state.survivors.idle}</span>
                </div>
              </div>
            `).join("")}
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Crew board",
        meta: `${state.survivors.total}/${derived.survivorCap}`,
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Total</span><strong>${state.survivors.total}</strong></div>
            <div class="fact"><span>Idle</span><strong>${state.survivors.idle}</strong></div>
            <div class="fact"><span>Wounded</span><strong>${woundedCount}</strong></div>
            <div class="fact"><span>Stressed</span><strong>${stressedCount}</strong></div>
            <div class="fact"><span>Morale</span><strong>${state.resources.morale}</strong></div>
            <div class="fact"><span>Rep</span><strong>${state.resources.reputation}</strong></div>
          </div>
          <div class="spacer-top">
            ${actionButton({
              action: "recruit",
              label: "Recruit survivor",
              meta: "22 scrap / 1 wood / 4 food / 2 water",
              disabled: state.survivors.total >= derived.survivorCap || !canAfford(state, { scrap: 22, wood: 1, food: 4, water: 2 }),
            })}
          </div>
        `,
      }),
      surfaceCard({
        title: "Crew pressure",
        meta: `${state.survivors.idle} idle`,
        body: renderCrewPressure(state),
      }),
      surfaceCard({
        title: "Roster traits",
        meta: `${roster.length} people`,
        body: roster.length
          ? `
            <div class="detail-list">
              ${roster.map((survivor) => `
                <div class="list-block compact-block">
                  <div class="surface-head">
                    <h4>${survivor.name}</h4>
                    <span class="tag">${survivor.role === "idle" ? "idle" : SURVIVOR_ROLES[survivor.role]?.label || survivor.role}</span>
                  </div>
                  <div class="chip-row">${tagList([
                    SURVIVOR_TRAITS[survivor.traitId]?.label || survivor.traitId,
                    SURVIVOR_TRAITS[survivor.traitId]?.summary || "trait",
                    survivor.wounded > 0 ? `wounded ${survivor.wounded}` : "unhurt",
                    survivor.stress > 0 ? `stress ${survivor.stress}` : "steady",
                  ])}</div>
                </div>
              `).join("")}
            </div>
          `
          : `<p class="empty-state">No roster yet.</p>`,
      }),
    ],
    "tab-columns-crew"
  );
}

function renderRadioTab(state, isMobile = false) {
  const availableInvestigations = getAvailableRadioInvestigations(state);
  const board = getRadioBoard(state);
  const notes = [];
  const lastSweep = state.radio.lastSweep;
  if (state.story.radioProgress === 0) notes.push("Band mostly dead.");
  if (state.story.radioProgress >= 2) notes.push("Routes and hospitals are surfacing.");
  if (state.story.radioProgress >= 4) notes.push("Signal feels active, not archival.");
  if (state.flags.bunkerRouteKnown) notes.push("Bunker route confirmed.");
  if (state.flags.worldReveal) notes.push("Dead Static was built.");

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-radio">
        ${surfaceCard({
          title: "Receiver board",
          meta: `signal ${state.story.radioProgress}`,
          body: `
            ${renderSignalSpectrum(state)}
            <div class="fact-grid">
              <div class="fact"><span>Signal</span><strong>${state.story.radioProgress}</strong></div>
              <div class="fact"><span>Secret</span><strong>${state.story.secretProgress}</strong></div>
              <div class="fact"><span>Scans</span><strong>${state.stats.radioScans}</strong></div>
              <div class="fact"><span>Reveal</span><strong>${state.flags.worldReveal ? "partial" : "unknown"}</strong></div>
            </div>
            ${actionButton({
              action: "scan-radio",
              label: "Sweep band",
              meta: "1 fuel / 1 parts",
              disabled: state.resources.fuel < 1 || state.resources.parts < 1,
              variant: "primary",
            })}
          `,
        })}
        ${surfaceCard({
          title: "Investigations",
          meta: `${availableInvestigations.length} tracks`,
          body: availableInvestigations.length
            ? `<div class="detail-list">${board.map((investigation) => `
                <div class="list-block compact-block ${state.radio.investigation === investigation.id ? "is-selected-plan" : ""}">
                  <div class="surface-head">
                    <h4>${investigation.label}</h4>
                    <span class="tag">${investigation.trace}</span>
                  </div>
                  <div class="chip-row">${tagList([
                    investigation.short,
                    `${investigation.resolvedCount}/${investigation.totalMilestones} cracked`,
                    investigation.nextAt ? `next ${investigation.nextAt}` : "track exhausted",
                  ])}</div>
                  <p class="note">${investigation.nextText}</p>
                  ${actionButton({
                    action: "set-radio-investigation",
                    label: investigation.label,
                    meta: "focus track",
                    disabled: state.radio.investigation === investigation.id,
                    data: { investigation: investigation.id },
                    variant: "compact",
                  })}
                </div>
              `).join("")}</div>`
            : `<p class="empty-state">Nothing legible yet.</p>`,
        })}
        ${accordionSection("Signal chain", `${notes.length} live`, `
          <div class="detail-list">
            <div class="list-block compact-block">
              <div class="chip-row">${tagList(notes.length ? notes : ["No stable threads yet."])}</div>
            </div>
          </div>
        `, true)}
        ${accordionSection("Mystery board", `${board.reduce((sum, investigation) => sum + investigation.resolvedCount, 0)} clues`, `
          <div class="detail-list">
            ${board.map((investigation) => `
              <div class="list-block compact-block">
                <div class="surface-head">
                  <h4>${investigation.label}</h4>
                  <span class="tag">${investigation.resolvedCount}/${investigation.totalMilestones}</span>
                </div>
                <p class="note">${investigation.nextText}</p>
              </div>
            `).join("")}
          </div>
        `)}
        ${accordionSection("Anomaly trace", state.flags.worldReveal ? "exposed" : "partial", renderAnomalyTrace(state))}
      </div>
    `;
  }

  return renderSplitPane(
    [
      surfaceCard({
        title: "Investigations",
        meta: `${availableInvestigations.length} tracks`,
        body: availableInvestigations.length
          ? `
            <div class="detail-list">
              ${board.map((investigation) => `
                <div class="list-block compact-block ${state.radio.investigation === investigation.id ? "is-selected-plan" : ""}">
                  <div class="surface-head">
                    <h4>${investigation.label}</h4>
                    <span class="tag">${investigation.trace}</span>
                  </div>
                  <div class="chip-row">${tagList([
                    investigation.short,
                    `${investigation.resolvedCount}/${investigation.totalMilestones} cracked`,
                    investigation.nextAt ? `next ${investigation.nextAt}` : "track exhausted",
                  ])}</div>
                  <p class="note">${investigation.nextText}</p>
                  ${actionButton({
                    action: "set-radio-investigation",
                    label: investigation.label,
                    meta: "receiver target",
                    disabled: state.radio.investigation === investigation.id,
                    data: { investigation: investigation.id },
                    variant: "compact",
                  })}
                </div>
              `).join("")}
            </div>
          `
          : `<p class="empty-state">Nothing legible yet.</p>`,
      }),
      surfaceCard({
        title: "Signal chain",
        meta: `${notes.length} live`,
        body: `
          <div class="detail-list">
            <div class="list-block">
              <div class="surface-head">
                <h4>Band state</h4>
                <span class="tag">${state.flags.worldReveal ? "open" : "partial"}</span>
              </div>
              <p class="note">${notes.join(" ") || "No stable threads yet."}</p>
            </div>
            <div class="list-block">
              <div class="surface-head">
                <h4>Route hooks</h4>
                <span class="tag">${state.flags.bunkerRouteKnown ? "marked" : "hidden"}</span>
              </div>
              <p class="note">${state.flags.bunkerRouteKnown ? "Bunker route threaded." : "Keep scanning sublevel and anomaly traces."}</p>
            </div>
            <div class="list-block">
              <div class="surface-head">
                <h4>Mystery board</h4>
                <span class="tag">${board.reduce((sum, investigation) => sum + investigation.resolvedCount, 0)} clues</span>
              </div>
              <div class="chip-row">${tagList(board.map((investigation) => `${investigation.label} ${investigation.resolvedCount}/${investigation.totalMilestones}`))}</div>
            </div>
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Receiver board",
        meta: `signal ${state.story.radioProgress}`,
        body: `
          ${renderSignalSpectrum(state)}
          <div class="fact-grid">
            <div class="fact"><span>Signal</span><strong>${state.story.radioProgress}</strong></div>
            <div class="fact"><span>Secret</span><strong>${state.story.secretProgress}</strong></div>
            <div class="fact"><span>Scans</span><strong>${state.stats.radioScans}</strong></div>
            <div class="fact"><span>Reveal</span><strong>${state.flags.worldReveal ? "partial" : "unknown"}</strong></div>
          </div>
          ${lastSweep ? `<div class="chip-row">${tagList([
            RADIO_INVESTIGATIONS.find((investigation) => investigation.id === lastSweep.investigationId)?.label || lastSweep.investigationId,
            `trace +${lastSweep.gain}`,
            lastSweep.stamp,
          ])}</div>` : ""}
          <div class="spacer-top">
            ${actionButton({
              action: "scan-radio",
              label: "Sweep band",
              meta: "1 fuel / 1 parts",
              disabled: state.resources.fuel < 1 || state.resources.parts < 1,
            })}
          </div>
        `,
      }),
      surfaceCard({
        title: "Anomaly trace",
        meta: state.flags.worldReveal ? "exposed" : "partial",
        body: renderAnomalyTrace(state),
      }),
    ],
    "tab-columns-radio"
  );
}

function renderTradeTab(state, _isMobile = false) {
  const channels = getAvailableTraderChannels(state);
  const offers = state.trader.offers
    .map((offerId) => TRADER_OFFERS.find((offer) => offer.id === offerId))
    .filter(Boolean);

  return renderSplitPane(
    [
      surfaceCard({
        title: "Offer wall",
        meta: state.trader.channel || "quiet",
        body: offers.length
          ? `<div class="offer-grid">${offers.map((offer) => `
            <div class="list-block trade-offer-card">
              <div class="surface-head">
                <h4>${offer.name}</h4>
                <span class="tag">${formatCost(getTraderOfferCost(state, offer))}</span>
              </div>
              <p class="note">${offer.description}</p>
              ${actionButton({
                action: "buy-offer",
                label: "Trade",
                meta: "Take the deal",
                disabled: !canAfford(state, getTraderOfferCost(state, offer)),
                data: { offer: offer.id },
              })}
            </div>
          `).join("")}</div>`
          : `<p class="empty-state">Open a channel to pull current stock.</p>`,
      }),
    ],
    [
      surfaceCard({
        title: "Channels",
        meta: `${channels.length} live`,
        body: `
          <div class="detail-list">
            ${channels.map((channel) => `
              <div class="list-block compact-block ${state.trader.channel === channel.id ? "is-selected-plan" : ""}">
                <div class="surface-head">
                  <h4>${channel.name}</h4>
                  <span class="tag">${channel.tag}</span>
                </div>
                <p class="note">${channel.description}</p>
                ${actionButton({
                  action: "request-trader-channel",
                  label: channel.name,
                  meta: "open channel",
                  disabled: state.trader.channel === channel.id && offers.length > 0,
                  data: { channel: channel.id },
                  variant: "compact",
                })}
              </div>
            `).join("")}
          </div>
        `,
      }),
    ],
    "tab-columns-trade"
  );
}

function renderFactionTab(state, _isMobile = false) {
  return renderSplitPane(
    [
      `<div class="tab-inline-grid faction-grid">
        ${FACTIONS.map((faction) => surfaceCard({
          title: faction.name,
          meta: state.faction.aligned === faction.id ? "aligned" : "available",
          className: "faction-card",
          body: `
            <p class="note">${faction.description}</p>
            <div class="chip-row">${tagList(faction.bonuses)}</div>
            ${faction.costs?.length ? `<div class="chip-row">${tagList(faction.costs)}</div>` : ""}
            ${actionButton({
              action: "choose-faction",
              label: state.faction.aligned === faction.id ? "Aligned" : `Align with ${faction.name}`,
              meta: "Permanent choice",
              disabled: Boolean(state.faction.aligned),
              data: { faction: faction.id },
            })}
          `,
        })).join("")}
      </div>`,
    ],
    [
      surfaceCard({
        title: "Alignment board",
        meta: state.faction.aligned ? "locked" : "open",
        body: renderFactionStatus(state),
      }),
    ],
    "tab-columns-factions"
  );
}

function renderLeaderboardTab(state, isMobile = false) {
  const board = getLeaderboardState();
  const snapshot = getLeaderboardSnapshot(state);
  const username = snapshot.playerName || state.player.username || "";
  const boardStatus = leaderboardStatusLabel(board);
  const submitDisabled = !board.enabled || !username || username.length < 3 || board.submitStatus === "submitting";
  const refreshDisabled = !board.enabled || board.status === "loading";

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-leaderboard">
        ${surfaceCard({
          title: "Global leaderboard",
          meta: board.enabled ? "hosted" : "offline",
          body: `
            ${accordionSection("Current run", `${snapshot.summary.score}`, `
              <div class="detail-list">
                <div class="list-block compact-block">
                  <div class="surface-head">
                    <h4>${username || "Username not set"}</h4>
                    <span class="tag">${snapshot.summary.stage}</span>
                  </div>
                  ${leaderboardRunSummary(snapshot, username)}
                </div>
                <div class="action-stack">
                  ${actionButton({
                    action: "set-callsign",
                    label: username ? "Edit username" : "Set username",
                    meta: "leaderboard profile",
                    variant: "primary compact",
                  })}
                  ${actionButton({
                    action: "submit-leaderboard",
                    label: "Submit run",
                    meta: "upload best score",
                    disabled: submitDisabled,
                    variant: "compact",
                  })}
                </div>
              </div>
            `, true)}
            ${accordionSection("Board status", boardStatus, `
              <div class="detail-list">
                <div class="list-block compact-block">
                  <div class="surface-head">
                    <h4>Status</h4>
                    <span class="tag">${boardStatus}</span>
                  </div>
                  <p class="note">${leaderboardStatusMessage(board)}</p>
                  ${actionButton({
                    action: "refresh-leaderboard",
                    label: "Refresh board",
                    meta: "pull hosted rankings",
                    disabled: refreshDisabled,
                    variant: "compact",
                  })}
                </div>
              </div>
            `, true)}
            ${accordionSection("Hosted ranks", `${board.entries.length} live`, leaderboardEntriesMarkup(board.entries))}
            ${accordionSection("Save transfer", "cross-device", `
              <div class="action-stack">
                ${actionButton({
                  action: "download-save-file",
                  label: "Download save file",
                  meta: "json export",
                  variant: "compact",
                })}
                ${actionButton({
                  action: "copy-save-code",
                  label: "Copy save code",
                  meta: "portable code",
                  variant: "compact",
                })}
                ${actionButton({
                  action: "import-save-code",
                  label: "Paste save code",
                  meta: "import run",
                  variant: "compact",
                })}
              </div>
            `)}
          `,
        })}
      </div>
    `;
  }

  return renderSplitPane(
    [
      surfaceCard({
        title: "Global leaderboard",
        meta: board.enabled ? "hosted" : "offline",
        body: leaderboardEntriesMarkup(board.entries),
      }),
    ],
    [
      surfaceCard({
        title: "Current run",
        meta: `${snapshot.summary.score}`,
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>${username || "Username not set"}</h4>
                <span class="tag">${snapshot.summary.stage}</span>
              </div>
              ${leaderboardRunSummary(snapshot, username)}
            </div>
          </div>
          <div class="action-stack">
            ${actionButton({
              action: "set-callsign",
              label: username ? "Edit username" : "Set username",
              meta: "leaderboard profile",
              variant: "primary compact",
            })}
            ${actionButton({
              action: "submit-leaderboard",
              label: "Submit run",
              meta: "upload best score",
              disabled: submitDisabled,
              variant: "compact",
            })}
          </div>
        `,
      }),
      surfaceCard({
        title: "Board status",
        meta: boardStatus,
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <p class="note">${leaderboardStatusMessage(board)}</p>
            </div>
          </div>
          <div class="action-stack">
            ${actionButton({
              action: "refresh-leaderboard",
              label: "Refresh board",
              meta: "pull hosted rankings",
              disabled: refreshDisabled,
              variant: "compact",
            })}
          </div>
        `,
      }),
      surfaceCard({
        title: "Save transfer",
        meta: "cross-device",
        body: `
          <div class="action-stack">
            ${actionButton({
              action: "download-save-file",
              label: "Download save file",
              meta: "json export",
              variant: "compact",
            })}
            ${actionButton({
              action: "copy-save-code",
              label: "Copy save code",
              meta: "portable code",
              variant: "compact",
            })}
            ${actionButton({
              action: "import-save-code",
              label: "Paste save code",
              meta: "import run",
              variant: "compact",
            })}
          </div>
        `,
      }),
    ],
    "tab-columns-leaderboard"
  );
}

function renderLogTab(state, isMobile = false) {
  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-log">
        ${surfaceCard({
          title: "Archive",
          meta: `${state.log.length} entries`,
          body: `
            ${accordionSection("Patch notes", `${PATCH_NOTES[0].version}`, renderPatchNotes(), true)}
            ${accordionSection("Recent feed", `${Math.min(10, state.log.length)} latest`, renderMiniLog(state.log, 10), true)}
            ${accordionSection("Event pulse", `${state.log.length} entries`, renderLogPulse(state))}
            ${accordionSection("Full archive", `${state.log.length} total`, `
              <div class="full-log">
                ${state.log.map((entry) => `
                  <div class="mini-log-line log-${entry.category || "general"}">
                    <span>${entry.stamp}</span>
                    <p>${entry.text}</p>
                  </div>
                `).join("")}
              </div>
            `)}
          `,
        })}
      </div>
    `;
  }

  return renderSplitPane(
    [
      surfaceCard({
        title: "Archive",
        meta: `${state.log.length} entries`,
        body: `
          <div class="full-log">
            ${state.log.map((entry) => `
              <div class="mini-log-line log-${entry.category || "general"}">
                <span>${entry.stamp}</span>
                <p>${entry.text}</p>
              </div>
            `).join("")}
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Patch notes",
        meta: PATCH_NOTES[0].version,
        body: renderPatchNotes(),
      }),
      surfaceCard({
        title: "Event pulse",
        meta: `${state.log.length} entries`,
        body: renderLogPulse(state),
      }),
      surfaceCard({
        title: "Recent feed",
        meta: `${Math.min(10, state.log.length)} latest`,
        body: renderMiniLog(state.log, 10),
      }),
    ],
    "tab-columns-log"
  );
}

function renderHelpTab(state, isMobile = false) {
  const tutorialStep = getTutorialStep(state);
  const earlyLoop = [
    "Loot rubble until warmth and shelter storage are real.",
    "Stabilize food and drinkable water before overbuilding.",
    "Collect wood, scrap, parts, cloth, and wire with intent.",
    "Turn one room into a shelter before you chase the city.",
  ];
  const combatGuide = [
    "Attack when the enemy intent looks weak or you can finish it.",
    "Brace against heavy intents to reduce the next hit.",
    "Bandage only when the item saves more condition than the fight will cost.",
    "Retreat is for bad fights, not default fights.",
  ];
  const signalGuide = [
    "Radio is secondary until the shelter can survive without panic.",
    "Pick one investigation and repeat it when you can afford the parts and fuel.",
    "Signal objectives and tower routes feed the radio board faster.",
    "Major mystery beats come from deliberate trace work, not blind luck.",
  ];

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-help">
        ${surfaceCard({
          title: "Field guide",
          meta: tutorialStep ? "guided" : "stable",
          body: `
            ${accordionSection("First 10 minutes", tutorialStep ? "guided" : "stable", `
              ${tutorialStep ? `
                <div class="list-block compact-block">
                  <div class="surface-head">
                    <h4>${tutorialStep.title}</h4>
                    <span class="tag">${tutorialStep.id}</span>
                  </div>
                  <div class="chip-row">${tagList(tutorialStep.chips)}</div>
                </div>
              ` : ""}
              <div class="list-block compact-block"><div class="chip-row">${tagList(earlyLoop)}</div></div>
            `, true)}
            ${accordionSection("Core loop", "loot -> survive -> defend", `
              <div class="detail-list">
                <div class="list-block compact-block"><div class="chip-row">${tagList(["loot", "stabilize", "collect resources", "survive", "build shelter", "build base", "defend"])}</div></div>
              </div>
            `)}
            ${accordionSection("Combat", "fight clean", `<div class="list-block compact-block"><div class="chip-row">${tagList(combatGuide)}</div></div>`)}
            ${accordionSection("Mid-game systems", "what matters later", `<div class="list-block compact-block"><div class="chip-row">${tagList(signalGuide)}</div></div>`)}
          `,
        })}
      </div>
    `;
  }

  return renderSplitPane(
    [
      surfaceCard({
        title: "First 10 minutes",
        meta: tutorialStep ? "guided" : "stable",
        body: `
          <div class="detail-list">
            ${tutorialStep ? `
              <div class="list-block compact-block">
                <div class="surface-head">
                  <h4>Current tutorial step</h4>
                  <span class="tag">${tutorialStep.id}</span>
                </div>
                <p class="note">${tutorialStep.summary}</p>
                <div class="chip-row">${tagList(tutorialStep.chips)}</div>
              </div>
            ` : ""}
            <div class="list-block compact-block">
              <div class="chip-row">${tagList(earlyLoop)}</div>
            </div>
          </div>
        `,
      }),
      surfaceCard({
        title: "Core loop",
        meta: "loot -> survive -> build -> defend",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block"><p class="note"><strong>Loot:</strong> pull scrap, wood, water, and salvage out of the city.</p></div>
            <div class="list-block compact-block"><p class="note"><strong>Stabilize + survive:</strong> hold condition, warmth, food, water, threat, and noise together.</p></div>
            <div class="list-block compact-block"><p class="note"><strong>Build shelter -> build base -> defend:</strong> shelter systems turn panic into structure, then structure into a defended base.</p></div>
          </div>
        `,
      }),
      surfaceCard({
        title: "Systems after the early game",
        meta: "what matters later",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block"><div class="chip-row">${tagList(signalGuide)}</div></div>
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Combat quick guide",
        meta: "fight clean",
        body: `<div class="detail-list"><div class="list-block compact-block"><div class="chip-row">${tagList(combatGuide)}</div></div></div>`,
      }),
      surfaceCard({
        title: "What each tab is for",
        meta: "read once",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block"><p class="note"><strong>Overview:</strong> next best action and current pressure.</p></div>
            <div class="list-block compact-block"><p class="note"><strong>Craft:</strong> split base builds from fieldcraft and read what to scavenge next.</p></div>
            <div class="list-block compact-block"><p class="note"><strong>Shelter:</strong> manage food, water, warmth, defense, and repairs.</p></div>
            <div class="list-block compact-block"><p class="note"><strong>Map / Radio / Crew:</strong> direction-setting systems, not early obligations.</p></div>
          </div>
        `,
      }),
    ],
    "tab-columns-help"
  );
}

function renderSettingsTab(state, isMobile = false) {
  const toggles = [
    {
      key: "tutorialHints",
      title: "Tutorial hints",
      note: "Shows the single-step onboarding guide.",
    },
    {
      key: "briefStageCopy",
      title: "Compact stage copy",
      note: "Hides the longer description under each tab banner.",
    },
    {
      key: "reducedMotion",
      title: "Reduced motion",
      note: "Cuts animation and transition noise.",
    },
    {
      key: "confirmReset",
      title: "Confirm reset",
      note: "Ask before wiping the current run.",
    },
  ];

  if (isMobile) {
    return `
      <div class="tab-mobile-flow tab-mobile-flow-settings">
        ${surfaceCard({
          title: "Settings",
          meta: "mobile controls",
          body: `
            ${accordionSection("Profile", state.player.username || "unset", `
              <div class="detail-list">
                <div class="list-block compact-block">
                  <div class="surface-head">
                    <h4>Username</h4>
                    <span class="tag">${state.player.username || "not set"}</span>
                  </div>
                  ${actionButton({
                    action: "set-username",
                    label: state.player.username ? "Change Username" : "Set Username",
                    meta: "profile",
                    variant: "primary compact",
                  })}
                </div>
              </div>
            `, true)}
            ${accordionSection("Interface", "toggles", `
              <div class="detail-list">
                ${toggles.map((toggle) => `
                  <div class="list-block compact-block setting-row">
                    <div class="surface-head">
                      <h4>${toggle.title}</h4>
                      <span class="tag">${state.settings[toggle.key] ? "on" : "off"}</span>
                    </div>
                    ${actionButton({
                      action: "toggle-setting",
                      label: state.settings[toggle.key] ? "Turn off" : "Turn on",
                      meta: toggle.title,
                      data: { setting: toggle.key },
                      variant: "compact",
                    })}
                  </div>
                `).join("")}
              </div>
            `)}
            ${accordionSection("Run controls", `Day ${state.time.day}`, `
              <div class="detail-list">
                <div class="action-stack">
                  ${actionButton({
                    action: "save-game",
                    label: "Save run",
                    meta: "local storage",
                    variant: "compact",
                  })}
                  ${actionButton({
                    action: "reset-game",
                    label: "Reset run",
                    meta: state.settings.confirmReset ? "with confirmation" : "instant wipe",
                    variant: "compact danger",
                  })}
                </div>
              </div>
            `)}
          `,
        })}
      </div>
    `;
  }

  return renderSplitPane(
    [
      surfaceCard({
        title: "Profile",
        meta: state.player.username || "unset",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <div class="surface-head">
                <h4>Username</h4>
                <span class="tag">${state.player.username || "not set"}</span>
              </div>
              <p class="note">Set once for this save. The tutorial asks for it first.</p>
              ${actionButton({
                action: "set-username",
                label: state.player.username ? "Change Username" : "Set Username",
                meta: "profile",
                variant: "primary compact",
              })}
            </div>
          </div>
        `,
      }),
      surfaceCard({
        title: "Interface",
        meta: "live toggles",
        body: `
          <div class="detail-list">
            ${toggles.map((toggle) => `
              <div class="list-block compact-block setting-row">
                <div class="surface-head">
                  <h4>${toggle.title}</h4>
                  <span class="tag">${state.settings[toggle.key] ? "on" : "off"}</span>
                </div>
                <p class="note">${toggle.note}</p>
                ${actionButton({
                  action: "toggle-setting",
                  label: state.settings[toggle.key] ? "Turn off" : "Turn on",
                  meta: toggle.title,
                  data: { setting: toggle.key },
                  variant: "compact",
                })}
              </div>
            `).join("")}
          </div>
        `,
      }),
    ],
    [
      surfaceCard({
        title: "Current save",
        meta: `Day ${state.time.day}`,
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Searches</span><strong>${state.stats.searches}</strong></div>
            <div class="fact"><span>Expeditions</span><strong>${state.stats.expeditions}</strong></div>
            <div class="fact"><span>Scans</span><strong>${state.stats.radioScans}</strong></div>
            <div class="fact"><span>Crew</span><strong>${state.survivors.total}</strong></div>
          </div>
        `,
      }),
      surfaceCard({
        title: "Run controls",
        meta: "manual actions",
        body: `
          <div class="action-stack">
            ${actionButton({
              action: "save-game",
              label: "Save run",
              meta: "local storage",
              variant: "compact",
            })}
            ${actionButton({
              action: "reset-game",
              label: "Reset run",
              meta: state.settings.confirmReset ? "with confirmation" : "instant wipe",
              variant: "compact danger",
            })}
          </div>
        `,
      }),
      surfaceCard({
        title: "Tutorial state",
        meta: state.settings.tutorialHints ? "active" : "skipped",
        body: `
          <div class="detail-list">
            <div class="list-block compact-block">
              <p class="note">${state.settings.tutorialHints ? "Tutorial guidance is active." : "Tutorial guidance is skipped. Re-enable it any time."}</p>
              ${!state.settings.tutorialHints ? actionButton({
                action: "toggle-setting",
                label: "Re-enable tutorial",
                meta: "guided onboarding",
                data: { setting: "tutorialHints" },
                variant: "compact",
              }) : ""}
            </div>
          </div>
        `,
      }),
    ],
    "tab-columns-settings"
  );
}

function renderCombatBanner(state) {
  const banner = byId("combat-banner");
  if (!state.combat) {
    banner.classList.add("is-hidden");
    banner.innerHTML = "";
    return;
  }

  const enemy = ENEMIES[state.combat.enemyId];
  banner.classList.remove("is-hidden");
  banner.innerHTML = `
    <div class="combat-core">
      <pre>${enemy.ascii.join("\n")}</pre>
      <div class="combat-copy">
        <div class="surface-head">
          <h3>${enemy.name}</h3>
          <span class="tag danger">${state.combat.enemyHp} hp</span>
        </div>
        <p class="note">${enemy.description}</p>
        <div class="chip-row">${tagList([
          `intent ${state.combat.intent}`,
          `turn ${state.combat.turn}`,
          state.combat.grappled ? "grappled" : "mobile",
          enemy.behavior?.summary || "hostile",
        ])}</div>
        <div class="action-row">
          ${actionButton({
            action: "combat-attack",
            label: "Attack",
            meta: "Commit",
            variant: "primary compact",
          })}
          ${actionButton({
            action: "combat-brace",
            label: "Brace",
            meta: "Cut the next hit",
            disabled: state.combat.brace > 0,
            variant: "compact",
          })}
          ${actionButton({
            action: "combat-heal",
            label: "Bandage",
            meta: "Use best medical item",
            disabled: !hasItem(state, "bandage_roll") && !hasItem(state, "first_aid_rag"),
            variant: "compact",
          })}
          ${actionButton({
            action: "combat-retreat",
            label: "Retreat",
            meta: "Lose ground",
            variant: "compact",
          })}
        </div>
      </div>
    </div>
  `;
}


// render.js
function renderTabContent(state, derived) {
  const isMobile = isMobileViewport();
  switch (state.ui.activeTab) {
    case "craft":
      return renderCraftTab(state, isMobile);
    case "inventory":
      return renderInventoryTab(state, derived, isMobile);
    case "shelter":
      return renderShelterTab(state, derived, isMobile);
    case "shelter_map":
      return renderShelterMapTab(state);
    case "map":
      return renderMapTab(state, isMobile);
    case "survivors":
      return renderSurvivorTab(state, derived, isMobile);
    case "radio":
      return renderRadioTab(state, isMobile);
    case "trade":
      return renderTradeTab(state, isMobile);
    case "factions":
      return renderFactionTab(state, isMobile);
    case "leaderboard":
      return renderLeaderboardTab(state, isMobile);
    case "log":
      return renderLogTab(state, isMobile);
    case "help":
      return renderHelpTab(state, isMobile);
    case "settings":
      return renderSettingsTab(state, isMobile);
    case "overview":
    default:
      return renderOverviewTab(state, derived, isMobile);
  }
}

function renderGame(state) {
  const derived = getDerivedState(state);
  const isMobile = isMobileViewport();
  const tabs = ensureActiveTab(state, isMobile);
  const tabContent = byId("tab-content");

  byId("day-clock").textContent = `Day ${state.time.day} / ${String(state.time.hour).padStart(2, "0")}:00`;
  renderSubtitle(state);
  renderResourceBar(state, isMobile);
  renderCondition(state, derived);
  renderSummaryStrip(state, derived);
  renderMobileSurvivalStrip(state, derived);
  renderCombatBanner(state);
  renderTabBar(state, isMobile ? [] : tabs);
  if (isMobile) {
    renderMobileBottomNav(state, tabs);
    renderMobileSheets(state, tabs);
  } else {
    byId("mobile-bottom-nav").innerHTML = "";
    byId("mobile-sheet-layer").innerHTML = "";
  }
  tabContent.dataset.tab = state.ui.activeTab;
  tabContent.dataset.mobile = isMobile ? "true" : "false";
  document.body.dataset.activeTab = state.ui.activeTab;
  document.body.dataset.mobile = isMobile ? "true" : "false";
  document.body.dataset.motion = state.settings.reducedMotion ? "reduced" : "full";
  document.body.dataset.copy = state.settings.briefStageCopy ? "brief" : "full";
  tabContent.innerHTML = renderTabStage(state, derived, renderTabContent(state, derived), isMobile);
}


// state.js
function defaultAssignedRoles() {
  return Object.fromEntries(Object.keys(SURVIVOR_ROLES).map((roleId) => [roleId, 0]));
}

function defaultBuffers() {
  return Object.fromEntries(RESOURCE_ORDER.map((resourceId) => [resourceId, 0]));
}

function defaultSettings() {
  return {
    tutorialHints: true,
    reducedMotion: false,
    briefStageCopy: false,
    confirmReset: true,
  };
}

function defaultRadioState() {
  return {
    investigation: "civic_band",
    traces: {
      civic_band: 0,
      tower_grid: 0,
      sublevel_echo: 0,
      anomaly_trace: 0,
    },
    resolved: [],
    lastSweep: null,
  };
}

function defaultTraderState() {
  return {
    offers: [],
    channel: "open_market",
    lastContact: null,
  };
}

function roleSequenceFromAssigned(assigned) {
  const sequence = [];
  Object.keys(SURVIVOR_ROLES).forEach((roleId) => {
    const amount = Math.max(0, assigned?.[roleId] || 0);
    for (let index = 0; index < amount; index += 1) {
      sequence.push(roleId);
    }
  });
  return sequence;
}

function normalizeRosterMember(member, index, fallbackRole = "idle") {
  const traitIds = Object.keys(SURVIVOR_TRAITS);
  const safeRole = member?.role && (member.role === "idle" || SURVIVOR_ROLES[member.role]) ? member.role : fallbackRole;
  const fallbackName = SURVIVOR_NAME_POOL[index % SURVIVOR_NAME_POOL.length];
  const fallbackTrait = traitIds[index % traitIds.length];

  return {
    id: member?.id || `survivor-${index + 1}`,
    name: member?.name || fallbackName,
    traitId: SURVIVOR_TRAITS[member?.traitId] ? member.traitId : fallbackTrait,
    role: safeRole,
    wounded: typeof member?.wounded === "number" ? Math.max(0, member.wounded) : 0,
    stress: typeof member?.stress === "number" ? Math.max(0, member.stress) : 0,
  };
}

function createRoster(total, assigned = {}, existingRoster = []) {
  const roles = roleSequenceFromAssigned(assigned);
  const roster = [];

  for (let index = 0; index < total; index += 1) {
    roster.push(normalizeRosterMember(existingRoster[index], index, roles[index] || "idle"));
  }

  return roster;
}

function summarizeRoster(roster) {
  const assigned = defaultAssignedRoles();
  let idle = 0;

  roster.forEach((survivor) => {
    if (survivor.role && survivor.role !== "idle" && assigned[survivor.role] !== undefined) {
      assigned[survivor.role] += 1;
    } else {
      idle += 1;
    }
  });

  return {
    total: roster.length,
    idle,
    assigned,
  };
}

function createInitialState() {
  return {
    version: 8,
    time: {
      day: 1,
      hour: 7,
    },
    condition: 78,
    resources: {
      scrap: 0,
      wood: 0,
      food: 0,
      water: 0,
      cloth: 0,
      fuel: 0,
      parts: 0,
      wire: 0,
      medicine: 0,
      ammo: 0,
      electronics: 0,
      chemicals: 0,
      morale: 0,
      reputation: 0,
      relics: 0,
    },
    discoveredResources: ["scrap"],
    unlockedSections: [],
    unlockedZones: [],
    upgrades: [],
    inventory: {},
    equipped: {
      weapon: null,
      armor: null,
    },
    survivors: {
      total: 0,
      idle: 0,
      assigned: defaultAssignedRoles(),
      roster: [],
    },
    shelter: {
      warmth: 0,
      threat: 0,
      noise: 0,
      damage: {},
    },
    story: {
      radioProgress: 0,
      secretProgress: 0,
    },
    stats: {
      searches: 0,
      scavengeSources: {},
      burnUses: 0,
      foodSearches: 0,
      expeditions: 0,
      combatsWon: 0,
      nightsSurvived: 0,
      radioScans: 0,
      traderRefreshes: 0,
      zonesVisited: 0,
    },
    flags: {
      burnUnlocked: false,
      firstNightResolved: false,
      worldReveal: false,
      bunkerRouteKnown: false,
    },
    trader: {
      ...defaultTraderState(),
    },
    faction: {
      aligned: null,
    },
    player: {
      username: "",
    },
    radio: defaultRadioState(),
    buffers: {
      resources: defaultBuffers(),
      condition: 0,
    },
    clocks: {
      hunger: 0,
      thirst: 0,
      maintenance: 0,
    },
    night: {
      plan: "hold_fast",
      siegePressure: 0,
      breachCount: 0,
      lastReport: null,
    },
    expedition: {
      selectedZone: null,
      approach: "standard",
      objective: "salvage",
      lastRouteEvent: null,
      lastOutcome: null,
    },
    ui: {
      activeTab: "overview",
      inspectedStructure: "shelter_core",
      notableFind: null,
      mobileMoreOpen: false,
      mobileResourceDrawerOpen: false,
      mobileShelterMode: "ops",
      mobileInspectorStructure: null,
    },
    settings: defaultSettings(),
    seenEvents: [],
    visitedZones: [],
    combat: null,
    log: [
      {
        stamp: "D1 07:00",
        text: "You wake in a room with one chair, one door, and too much silence outside.",
      },
      {
        stamp: "D1 07:00",
        text: "The radio on the floor is dead. The static in the walls is not.",
      },
    ],
  };
}

function normalizeState(rawState) {
  const fresh = createInitialState();
  const state = rawState && typeof rawState === "object" ? rawState : {};
  const legacyRoster = Array.isArray(state.survivors?.roster) ? state.survivors.roster : [];
  const survivorTotal = Math.max(
    legacyRoster.length,
    Number.isFinite(state.survivors?.total) ? Math.max(0, state.survivors.total) : 0,
  );
  const roster = createRoster(survivorTotal, state.survivors?.assigned || {}, legacyRoster);
  const survivorSummary = summarizeRoster(roster);

  return {
    ...fresh,
    ...state,
    time: { ...fresh.time, ...state.time },
    resources: { ...fresh.resources, ...state.resources },
    discoveredResources: Array.isArray(state.discoveredResources)
      ? [...new Set(state.discoveredResources)]
      : fresh.discoveredResources,
    unlockedSections: Array.isArray(state.unlockedSections)
      ? [...new Set(state.unlockedSections)]
      : fresh.unlockedSections,
    unlockedZones: Array.isArray(state.unlockedZones)
      ? [...new Set(state.unlockedZones)]
      : fresh.unlockedZones,
    upgrades: Array.isArray(state.upgrades) ? [...new Set(state.upgrades)] : fresh.upgrades,
    inventory: { ...fresh.inventory, ...state.inventory },
    equipped: { ...fresh.equipped, ...state.equipped },
    survivors: {
      ...fresh.survivors,
      ...state.survivors,
      ...survivorSummary,
      roster,
    },
    shelter: { ...fresh.shelter, ...state.shelter },
    story: { ...fresh.story, ...state.story },
    stats: { ...fresh.stats, ...state.stats },
    flags: { ...fresh.flags, ...state.flags },
    trader: { ...fresh.trader, ...state.trader },
    faction: { ...fresh.faction, ...state.faction },
    player: { ...fresh.player, ...state.player },
    radio: {
      ...fresh.radio,
      ...state.radio,
      traces: {
        ...fresh.radio.traces,
        ...(state.radio?.traces || {}),
      },
      resolved: Array.isArray(state.radio?.resolved) ? [...new Set(state.radio.resolved)] : fresh.radio.resolved,
    },
    ui: { ...fresh.ui, ...state.ui },
    settings: { ...fresh.settings, ...state.settings },
    night: { ...fresh.night, ...state.night },
    expedition: { ...fresh.expedition, ...state.expedition },
    buffers: {
      resources: {
        ...fresh.buffers.resources,
        ...(state.buffers?.resources || {}),
      },
      condition: typeof state.buffers?.condition === "number" ? state.buffers.condition : 0,
    },
    clocks: { ...fresh.clocks, ...state.clocks },
    seenEvents: Array.isArray(state.seenEvents) ? [...new Set(state.seenEvents)] : fresh.seenEvents,
    visitedZones: Array.isArray(state.visitedZones) ? [...new Set(state.visitedZones)] : fresh.visitedZones,
    combat: state.combat || null,
    log: Array.isArray(state.log) && state.log.length ? state.log.slice(0, 60) : fresh.log,
  };
}

function loadState() {
  try {
    const serialized = window.localStorage.getItem(SAVE_KEY);
    if (!serialized) {
      return createInitialState();
    }

    return normalizeState(JSON.parse(serialized));
  } catch (_error) {
    return createInitialState();
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (_error) {
    // Allow play to continue even when the browser blocks local storage for local files.
  }
}

function clearSave() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch (_error) {
    // Ignore storage failures so reset can still rebuild in-memory state.
  }
}


// services/save-transfer.js
const SAVE_TRANSFER_PREFIX = "dead-static-save:";

function encodeUtf8(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeUtf8(value) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function normalizeImportedText(raw) {
  const text = String(raw || "").trim();
  if (!text) {
    throw new Error("No save data found.");
  }

  if (text.startsWith(SAVE_TRANSFER_PREFIX)) {
    return decodeUtf8(text.slice(SAVE_TRANSFER_PREFIX.length));
  }

  return text;
}

function parseImportedState(raw) {
  const parsed = JSON.parse(normalizeImportedText(raw));
  return migrateState(parsed);
}

function safeStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function encodeSaveState(state) {
  return `${SAVE_TRANSFER_PREFIX}${encodeUtf8(JSON.stringify(state))}`;
}

function downloadSaveFile(state) {
  const payload = JSON.stringify(state, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `dead-static-save-${safeStamp()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copySaveCode(state) {
  const payload = encodeSaveState(state);
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload);
    return payload;
  }

  if (typeof window?.prompt === "function") {
    window.prompt("Copy your Dead Static save code.", payload);
  }
  return payload;
}

function importSaveFromCode(raw) {
  return parseImportedState(raw);
}

async function importSaveFromFile(file) {
  if (!file) {
    throw new Error("No file selected.");
  }

  const text = await file.text();
  return parseImportedState(text);
}


// app.js
let state = loadState();
evaluateProgression(state);

const saveStatus = document.getElementById("autosave-status");

function isMobileViewport() {
  return typeof window !== "undefined" && Number(window.innerWidth || 0) <= 720;
}

function normalizeMobileTabTarget(tabId) {
  if (!isMobileViewport()) {
    return { tabId, shelterMode: null };
  }

  if (tabId === "shelter_map") {
    return { tabId: "shelter", shelterMode: "map" };
  }

  if (tabId === "shelter") {
    return { tabId: "shelter", shelterMode: "ops" };
  }

  return { tabId, shelterMode: null };
}

function setSaveStatus(text) {
  saveStatus.textContent = text;
}

function rerender() {
  renderGame(state);
}

function persist(label) {
  saveState(state);
  setSaveStatus(label);
}

function syncUsernameWithLeaderboard({ save = false } = {}) {
  const board = getLeaderboardState();
  const boardUsername = board.profile.codename || "";

  if (state.player.username && state.player.username !== boardUsername) {
    setLeaderboardUsername(state.player.username, { silent: true });
    return;
  }

  if (!state.player.username && boardUsername) {
    state.player.username = boardUsername;
    if (save) {
      saveState(state);
    }
  }
}

initLeaderboard({ onChange: rerender });
syncUsernameWithLeaderboard({ save: true });

function handleAction(action, button) {
  let changed = false;

  switch (action) {
    case "search-rubble":
      searchRubble(state);
      changed = true;
      break;
    case "search-source":
      changed = runScavengeSource(state, button.dataset.source);
      break;
    case "burn-warmth":
      changed = burnForWarmth(state);
      break;
    case "forage-food":
      forageFood(state);
      changed = true;
      break;
    case "buy-upgrade":
      changed = buyUpgrade(state, button.dataset.upgrade);
      break;
    case "inspect-structure":
      if (state.ui.inspectedStructure !== button.dataset.structure) {
        state.ui.inspectedStructure = button.dataset.structure;
        changed = true;
      }
      if (isMobileViewport()) {
        state.ui.mobileInspectorStructure = button.dataset.structure;
        state.ui.mobileShelterMode = "map";
        changed = true;
      }
      break;
    case "repair-structure":
      changed = repairStructure(state, button.dataset.structure);
      break;
    case "set-night-plan":
      changed = setNightPlan(state, button.dataset.plan);
      break;
    case "equip-item":
      changed = equipItem(state, button.dataset.item);
      break;
    case "use-item":
      changed = useItem(state, button.dataset.item);
      break;
    case "eat-ration":
      changed = eatRation(state);
      break;
    case "patch-barricade":
      changed = patchBarricade(state);
      break;
    case "craft-ammo":
      changed = craftAmmo(state);
      break;
    case "drink-water":
      changed = drinkWater(state);
      break;
    case "recruit":
      changed = recruitSurvivor(state);
      break;
    case "adjust-role":
      changed = adjustSurvivorRole(state, button.dataset.role, Number(button.dataset.delta));
      break;
    case "prepare-zone":
      changed = prepareExpedition(state, button.dataset.zone);
      break;
    case "set-approach":
      changed = setExpeditionApproach(state, button.dataset.approach);
      break;
    case "set-objective":
      changed = setExpeditionObjective(state, button.dataset.objective);
      break;
    case "launch-prepared":
      changed = launchPreparedExpedition(state);
      break;
    case "scavenge-zone":
      changed = scavengeZone(state, button.dataset.zone);
      break;
    case "scan-radio":
      changed = scanRadio(state);
      break;
    case "set-radio-investigation":
      changed = setRadioInvestigation(state, button.dataset.investigation);
      break;
    case "request-trader-channel":
      changed = requestTraderChannel(state, button.dataset.channel);
      break;
    case "buy-offer":
      changed = buyTraderOffer(state, button.dataset.offer);
      break;
    case "choose-faction":
      changed = chooseFaction(state, button.dataset.faction);
      break;
    case "combat-attack":
      changed = attackCombat(state);
      break;
    case "combat-heal":
      changed = useBestMedicalItem(state);
      break;
    case "combat-brace":
      changed = braceCombat(state);
      break;
    case "combat-retreat":
      changed = retreatCombat(state);
      break;
    case "set-callsign": {
      const before = state.player.username;
      if (!promptForCallsign()) {
        return;
      }
      const nextUsername = getLeaderboardState().profile.codename || "";
      if (nextUsername && nextUsername !== state.player.username) {
        state.player.username = nextUsername;
        changed = true;
      } else if (!nextUsername && state.player.username) {
        state.player.username = "";
        changed = true;
      } else {
        setSaveStatus(before ? "username updated" : "username ready");
        rerender();
        return;
      }
      break;
    }
    case "refresh-leaderboard":
      refreshLeaderboard();
      return;
    case "submit-leaderboard":
      if (state.player.username) {
        setLeaderboardUsername(state.player.username, { silent: true });
      }
      submitLeaderboardScore(state);
      return;
    case "download-save-file":
      downloadSaveFile(state);
      setSaveStatus("save file downloaded");
      return;
    case "copy-save-code":
      copySaveCode(state)
        .then(() => setSaveStatus("save code copied"))
        .catch(() => setSaveStatus("could not copy save code"));
      return;
    case "import-save-code": {
      const raw = typeof window.prompt === "function"
        ? window.prompt("Paste a Dead Static save code or raw JSON save.")
        : "";
      if (!raw) {
        return;
      }

      try {
        const nextState = importSaveFromCode(raw);
        evaluateProgression(nextState);
        state = nextState;
        syncUsernameWithLeaderboard();
        persist("save imported");
        rerender();
      } catch (error) {
        setSaveStatus(error.message || "import failed");
        if (typeof window.alert === "function") {
          window.alert(error.message || "Could not import save.");
        }
      }
      return;
    }
    case "set-tab":
      {
        const nextTarget = normalizeMobileTabTarget(button.dataset.tab);
        const nextTab = nextTarget.tabId;
        const nextShelterMode = nextTarget.shelterMode;

        state.ui.mobileMoreOpen = false;
        state.ui.mobileResourceDrawerOpen = false;
        if (nextTab !== "shelter") {
          state.ui.mobileInspectorStructure = null;
        }
        if (nextShelterMode) {
          state.ui.mobileShelterMode = nextShelterMode;
        }

        if (state.ui.activeTab !== nextTab) {
          state.ui.activeTab = nextTab;
          saveState(state);
          setSaveStatus("view saved");
          rerender();
          return;
        }

        if (nextShelterMode && state.ui.mobileShelterMode !== nextShelterMode) {
          state.ui.mobileShelterMode = nextShelterMode;
          saveState(state);
          setSaveStatus("view saved");
          rerender();
          return;
        }

        saveState(state);
        setSaveStatus("view saved");
        rerender();
        return;
      }
    case "toggle-mobile-more":
      state.ui.mobileMoreOpen = !state.ui.mobileMoreOpen;
      if (state.ui.mobileMoreOpen) {
        state.ui.mobileResourceDrawerOpen = false;
      }
      changed = true;
      break;
    case "close-mobile-more":
      if (state.ui.mobileMoreOpen) {
        state.ui.mobileMoreOpen = false;
        changed = true;
      }
      break;
    case "toggle-mobile-resource-drawer":
      state.ui.mobileResourceDrawerOpen = !state.ui.mobileResourceDrawerOpen;
      if (state.ui.mobileResourceDrawerOpen) {
        state.ui.mobileMoreOpen = false;
      }
      changed = true;
      break;
    case "close-mobile-resource-drawer":
      if (state.ui.mobileResourceDrawerOpen) {
        state.ui.mobileResourceDrawerOpen = false;
        changed = true;
      }
      break;
    case "set-mobile-shelter-mode":
      if (button.dataset.mode && state.ui.mobileShelterMode !== button.dataset.mode) {
        state.ui.mobileShelterMode = button.dataset.mode;
        if (button.dataset.mode === "ops") {
          state.ui.mobileInspectorStructure = null;
        }
        changed = true;
      }
      break;
    case "close-mobile-inspector":
      if (state.ui.mobileInspectorStructure) {
        state.ui.mobileInspectorStructure = null;
        changed = true;
      }
      break;
    case "toggle-setting":
      if (Object.prototype.hasOwnProperty.call(state.settings, button.dataset.setting)) {
        state.settings[button.dataset.setting] = !state.settings[button.dataset.setting];
        changed = true;
      }
      break;
    case "skip-tutorial":
      state.settings.tutorialHints = false;
      changed = true;
      break;
    case "set-username": {
      const boardUsername = getLeaderboardState().profile.codename || "";
      const nextUsername = typeof window.prompt === "function"
        ? window.prompt("Choose a username for this run.", state.player.username || boardUsername || "")
        : null;
      if (typeof nextUsername === "string") {
        const trimmed = nextUsername.trim().slice(0, 18);
        if (trimmed && trimmed !== state.player.username) {
          state.player.username = trimmed;
          setLeaderboardUsername(trimmed, { silent: true });
          changed = true;
        }
      }
      break;
    }
    case "save-game":
      persist("saved to local storage");
      rerender();
      return;
    case "reset-game":
      if (!state.settings.confirmReset || window.confirm("Reset Dead Static and erase the current local save?")) {
        clearSave();
        state = createInitialState();
        evaluateProgression(state);
        syncUsernameWithLeaderboard();
        persist("save wiped");
        rerender();
      }
      return;
    default:
      return;
  }

  if (changed) {
    persist("autosaved");
    rerender();
  }
}

document.body.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  handleAction(button.dataset.action, button);
});

rerender();
setSaveStatus("autosave armed");

if (typeof window.addEventListener === "function") {
  window.addEventListener("resize", () => {
    rerender();
  });
}

window.setInterval(() => {
  if (processRealtimeTick(state, 1)) {
    rerender();
  }
}, 1000);

window.setInterval(() => {
  persist("autosaved");
}, 15000);


