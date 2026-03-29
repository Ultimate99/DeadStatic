export const SAVE_KEY = "dead-static-save-v2";

export const RESOURCE_ORDER = [
  "scrap",
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

export const RESOURCE_DEFS = {
  scrap: { label: "Scrap", tier: "core" },
  food: { label: "Food", tier: "core" },
  water: { label: "Water", tier: "core" },
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

export const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "anomalous", "mythic"];

export const RARITY_DEFS = {
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

export const SURVIVOR_ROLES = {
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

export const SURVIVOR_NAME_POOL = [
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

export const SURVIVOR_TRAITS = {
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

export const ITEMS = {
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
    type: "weapon",
    attack: 4,
    description: "Good for doors and the things that linger behind them.",
  },
  nail_bat: {
    id: "nail_bat",
    name: "Nail Bat",
    type: "weapon",
    attack: 5,
    description: "No subtlety. Good weight.",
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

export const ITEM_ORDER = Object.keys(ITEMS);
