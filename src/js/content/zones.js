/* Generated during architecture split. */
export const ZONES = [
  {
    "id": "ruined_street",
    "name": "Ruined Street",
    "description": "Crushed storefronts, dead traffic, loose copper in the walls.",
    "risk": 1,
    "hours": 2,
    "encounterChance": 0.2,
    "enemies": [
      "walker",
      "screecher"
    ],
    "loot": {
      "scrap": [
        5,
        9
      ],
      "cloth": [
        1,
        2
      ],
      "water": [
        0,
        1
      ],
      "food": [
        0,
        2
      ],
      "parts": [
        1,
        2
      ],
      "fuel": [
        0,
        1
      ]
    },
    "itemPool": [
      "pry_bar",
      "canned_beans"
    ],
    "itemChance": 0.16
  },
  {
    "id": "burned_apartments",
    "name": "Burned Apartments",
    "description": "Stacked smoke damage and private tragedies.",
    "risk": 2,
    "hours": 3,
    "encounterChance": 0.28,
    "enemies": [
      "walker",
      "stalker"
    ],
    "loot": {
      "scrap": [
        7,
        12
      ],
      "cloth": [
        1,
        3
      ],
      "water": [
        1,
        2
      ],
      "food": [
        1,
        3
      ],
      "parts": [
        2,
        4
      ],
      "medicine": [
        0,
        1
      ]
    },
    "itemPool": [
      "patchwork_vest",
      "bandage_roll"
    ],
    "itemChance": 0.2
  },
  {
    "id": "abandoned_gas_station",
    "name": "Abandoned Gas Station",
    "description": "The pumps are dry, but the tanks forgot that.",
    "risk": 2,
    "hours": 3,
    "encounterChance": 0.3,
    "enemies": [
      "walker",
      "bloated_carrier"
    ],
    "loot": {
      "scrap": [
        4,
        8
      ],
      "water": [
        0,
        1
      ],
      "fuel": [
        2,
        5
      ],
      "parts": [
        1,
        3
      ],
      "chemicals": [
        0,
        1
      ]
    },
    "itemPool": [
      "fuel_cell",
      "transit_pistol"
    ],
    "itemChance": 0.2
  },
  {
    "id": "flooded_tunnel",
    "name": "Flooded Tunnel",
    "description": "Black water, old wiring, movement where there should be none.",
    "risk": 3,
    "hours": 4,
    "encounterChance": 0.38,
    "enemies": [
      "stalker",
      "bloated_carrier"
    ],
    "loot": {
      "scrap": [
        6,
        10
      ],
      "parts": [
        4,
        7
      ],
      "wire": [
        1,
        3
      ],
      "ammo": [
        1,
        3
      ],
      "relics": [
        0,
        1
      ]
    },
    "itemPool": [
      "nail_bat",
      "relay_key"
    ],
    "itemChance": 0.22
  },
  {
    "id": "hospital_wing",
    "name": "Hospital Wing",
    "description": "Curtains stiff with dust, corridors still giving orders.",
    "risk": 4,
    "hours": 4,
    "encounterChance": 0.42,
    "enemies": [
      "screecher",
      "static_touched"
    ],
    "loot": {
      "water": [
        1,
        2
      ],
      "medicine": [
        2,
        5
      ],
      "chemicals": [
        1,
        2
      ],
      "parts": [
        2,
        4
      ],
      "relics": [
        0,
        1
      ]
    },
    "itemPool": [
      "riot_padding",
      "bandage_roll"
    ],
    "itemChance": 0.24
  },
  {
    "id": "radio_tower_perimeter",
    "name": "Radio Tower Perimeter",
    "description": "The fence hums even without power. Especially without power.",
    "risk": 5,
    "hours": 5,
    "encounterChance": 0.5,
    "enemies": [
      "static_touched",
      "relay_brute"
    ],
    "loot": {
      "parts": [
        5,
        9
      ],
      "wire": [
        2,
        4
      ],
      "electronics": [
        1,
        2
      ],
      "fuel": [
        2,
        5
      ],
      "reputation": [
        2,
        4
      ],
      "relics": [
        1,
        2
      ]
    },
    "itemPool": [
      "tower_rifle",
      "static_lens"
    ],
    "itemChance": 0.26
  },
  {
    "id": "glass_orchard",
    "name": "Glass Orchard",
    "description": "An anomaly grove where frozen figures bloom from the road.",
    "risk": 5,
    "hours": 5,
    "encounterChance": 0.48,
    "enemies": [
      "stalker",
      "static_touched"
    ],
    "loot": {
      "water": [
        1,
        2
      ],
      "parts": [
        4,
        6
      ],
      "electronics": [
        0,
        1
      ],
      "morale": [
        1,
        2
      ],
      "relics": [
        1,
        3
      ]
    },
    "itemPool": [
      "signal_cloak",
      "odd_relic"
    ],
    "itemChance": 0.28
  },
  {
    "id": "hidden_bunker_entrance",
    "name": "Hidden Bunker Entrance",
    "description": "A concrete mouth under the city, still pretending not to exist.",
    "risk": 6,
    "hours": 5,
    "encounterChance": 0.56,
    "enemies": [
      "static_touched",
      "relay_brute"
    ],
    "loot": {
      "scrap": [
        8,
        12
      ],
      "parts": [
        6,
        10
      ],
      "wire": [
        2,
        4
      ],
      "electronics": [
        1,
        2
      ],
      "reputation": [
        3,
        5
      ],
      "relics": [
        2,
        4
      ]
    },
    "itemPool": [
      "bunker_pass",
      "fire_axe"
    ],
    "itemChance": 0.32
  }
];

export const ZONES_BY_ID = Object.fromEntries(ZONES.map((zone) => [zone.id, zone]));
