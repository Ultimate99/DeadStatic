/* Generated during architecture split. */
export const SCAVENGE_SOURCES = [
  {
    "id": "rubble",
    "label": "Search rubble",
    "short": "RU",
    "description": "Broken masonry, split wiring, wet cloth, open pockets.",
    "detail": "Balanced salvage. Cheap, quick, and still the only lane that always pays in scrap.",
    "focus": [
      "Scrap",
      "Cloth",
      "Water"
    ],
    "tags": [
      "1h",
      "low noise",
      "street debris"
    ],
    "hours": 1,
    "threat": 0.35,
    "noise": 0.4,
    "scrapMod": {
      "min": 0,
      "max": 0
    },
    "directResources": {},
    "guaranteed": [
      "common"
    ],
    "rolls": [
      {
        "rarity": "uncommon",
        "chance": 0.74
      },
      {
        "rarity": "rare",
        "chance": 0.16,
        "rareBonus": 1
      },
      {
        "rarity": "epic",
        "chance": 0.06,
        "rareBonus": 0.45,
        "requires": {
          "searches": 10
        }
      },
      {
        "rarity": "legendary",
        "chance": 0.025,
        "rareBonus": 0.2,
        "requires": {
          "searches": 18
        }
      },
      {
        "rarity": "anomalous",
        "chance": 0.018,
        "rareBonus": 0.16,
        "requires": {
          "radioProgress": 4
        }
      },
      {
        "rarity": "mythic",
        "chance": 0.012,
        "rareBonus": 0.08,
        "requires": {
          "flags": [
            "worldReveal"
          ]
        }
      }
    ],
    "bonusChance": 0.58,
    "rarityBias": {
      "uncommon": 0.02,
      "rare": 0.03
    },
    "logLabel": "the rubble",
    "eventChance": 0.42
  },
  {
    "id": "vehicle_shells",
    "label": "Strip vehicle shells",
    "short": "VH",
    "description": "Dash metal, fuel lines, batteries, and glovebox lies.",
    "detail": "Better for parts, wire, and fuel. Slightly louder than rubble and worth it.",
    "focus": [
      "Parts",
      "Fuel",
      "Wire"
    ],
    "tags": [
      "1h",
      "medium noise",
      "engine blocks"
    ],
    "hours": 1,
    "threat": 0.48,
    "noise": 0.72,
    "scrapMod": {
      "min": 0,
      "max": 1
    },
    "directResources": {
      "parts": [
        1,
        2
      ],
      "fuel": [
        0,
        1
      ]
    },
    "guaranteed": [
      "common",
      "uncommon"
    ],
    "rolls": [
      {
        "rarity": "rare",
        "chance": 0.24,
        "rareBonus": 1.1
      },
      {
        "rarity": "epic",
        "chance": 0.1,
        "rareBonus": 0.5,
        "requires": {
          "upgrades": [
            "crafting_bench"
          ]
        }
      },
      {
        "rarity": "legendary",
        "chance": 0.045,
        "rareBonus": 0.24,
        "requires": {
          "upgrades": [
            "watch_post"
          ]
        }
      },
      {
        "rarity": "anomalous",
        "chance": 0.014,
        "rareBonus": 0.1,
        "requires": {
          "radioProgress": 4
        }
      }
    ],
    "bonusChance": 0.66,
    "rarityBias": {
      "rare": 0.04,
      "epic": 0.03
    },
    "requires": {
      "searches": 4
    },
    "logLabel": "the vehicle shells",
    "eventChance": 0.46
  },
  {
    "id": "dead_pantries",
    "label": "Check dead pantries",
    "short": "PN",
    "description": "Cupboards, kitchen sinks, old shelves, and sealed luck.",
    "detail": "Reliable food and water lane. Low yield in scrap, high value when hunger starts talking.",
    "focus": [
      "Food",
      "Water",
      "Medicine"
    ],
    "tags": [
      "1h",
      "quiet",
      "food lane"
    ],
    "hours": 1,
    "threat": 0.28,
    "noise": 0.26,
    "scrapMod": {
      "min": -1,
      "max": 0
    },
    "directResources": {
      "food": [
        1,
        2
      ],
      "water": [
        1,
        1
      ]
    },
    "guaranteed": [
      "common",
      "uncommon"
    ],
    "rolls": [
      {
        "rarity": "rare",
        "chance": 0.18,
        "rareBonus": 0.9
      },
      {
        "rarity": "epic",
        "chance": 0.08,
        "rareBonus": 0.36,
        "requires": {
          "upgrades": [
            "food_crate"
          ]
        }
      },
      {
        "rarity": "legendary",
        "chance": 0.022,
        "rareBonus": 0.14,
        "requires": {
          "upgrades": [
            "smokehouse"
          ]
        }
      }
    ],
    "bonusChance": 0.54,
    "rarityBias": {
      "uncommon": 0.05,
      "rare": 0.02
    },
    "requires": {
      "upgrades": [
        "food_search"
      ]
    },
    "logLabel": "the dead pantries",
    "eventChance": 0.36
  },
  {
    "id": "clinic_drawers",
    "label": "Sweep clinic drawers",
    "short": "CL",
    "description": "Cracked cabinets, labelled trays, and pills no one came back for.",
    "detail": "Medicine lane. Slower to open up, but it starts paying in clean painkillers and better tools.",
    "focus": [
      "Medicine",
      "Chemicals",
      "Cloth"
    ],
    "tags": [
      "1h",
      "medium noise",
      "medical lane"
    ],
    "hours": 1,
    "threat": 0.38,
    "noise": 0.58,
    "scrapMod": {
      "min": -1,
      "max": 0
    },
    "directResources": {
      "medicine": [
        1,
        1
      ],
      "cloth": [
        0,
        1
      ]
    },
    "guaranteed": [
      "common",
      "uncommon"
    ],
    "rolls": [
      {
        "rarity": "rare",
        "chance": 0.3,
        "rareBonus": 1.15
      },
      {
        "rarity": "epic",
        "chance": 0.12,
        "rareBonus": 0.5,
        "requires": {
          "upgrades": [
            "crafting_bench"
          ]
        }
      },
      {
        "rarity": "legendary",
        "chance": 0.035,
        "rareBonus": 0.18,
        "requires": {
          "upgrades": [
            "smokehouse"
          ]
        }
      }
    ],
    "bonusChance": 0.6,
    "rarityBias": {
      "rare": 0.05,
      "epic": 0.03
    },
    "requires": {
      "upgrades": [
        "first_aid_rag"
      ]
    },
    "logLabel": "the clinic drawers",
    "eventChance": 0.44
  },
  {
    "id": "signal_wrecks",
    "label": "Trace signal wrecks",
    "short": "SG",
    "description": "Tower scrap, relay boxes, antenna guts, and static-burned hardware.",
    "detail": "Electronics lane. Stronger upper rarity access once the radio is online.",
    "focus": [
      "Wire",
      "Electronics",
      "Relics"
    ],
    "tags": [
      "2h",
      "high noise",
      "signal lane"
    ],
    "hours": 2,
    "threat": 0.62,
    "noise": 1.18,
    "scrapMod": {
      "min": -1,
      "max": 0
    },
    "directResources": {
      "wire": [
        1,
        2
      ],
      "electronics": [
        1,
        1
      ]
    },
    "guaranteed": [
      "uncommon"
    ],
    "rolls": [
      {
        "rarity": "rare",
        "chance": 0.34,
        "rareBonus": 1.2
      },
      {
        "rarity": "epic",
        "chance": 0.18,
        "rareBonus": 0.62,
        "requires": {
          "radioProgress": 1
        }
      },
      {
        "rarity": "legendary",
        "chance": 0.085,
        "rareBonus": 0.34,
        "requires": {
          "radioProgress": 2
        }
      },
      {
        "rarity": "anomalous",
        "chance": 0.05,
        "rareBonus": 0.24,
        "requires": {
          "radioProgress": 4
        }
      },
      {
        "rarity": "mythic",
        "chance": 0.018,
        "rareBonus": 0.12,
        "requires": {
          "flags": [
            "worldReveal"
          ]
        }
      }
    ],
    "bonusChance": 0.72,
    "rarityBias": {
      "epic": 0.05,
      "legendary": 0.04,
      "anomalous": 0.03
    },
    "requires": {
      "upgrades": [
        "radio_rig"
      ]
    },
    "logLabel": "the signal wrecks",
    "eventChance": 0.54
  },
  {
    "id": "sealed_caches",
    "label": "Crack sealed caches",
    "short": "SC",
    "description": "Locked service cases, ammo tins, and someone else's emergency plan.",
    "detail": "Late mid-game cache lane. Costs more threat, pays with gear and upper-tier hardware.",
    "focus": [
      "Ammo",
      "Parts",
      "Gear"
    ],
    "tags": [
      "2h",
      "high noise",
      "sealed stock"
    ],
    "hours": 2,
    "threat": 0.72,
    "noise": 1.34,
    "scrapMod": {
      "min": 0,
      "max": 1
    },
    "directResources": {
      "parts": [
        1,
        2
      ],
      "ammo": [
        1,
        2
      ]
    },
    "guaranteed": [
      "uncommon"
    ],
    "rolls": [
      {
        "rarity": "rare",
        "chance": 0.36,
        "rareBonus": 1.2
      },
      {
        "rarity": "epic",
        "chance": 0.2,
        "rareBonus": 0.65,
        "requires": {
          "upgrades": [
            "crafting_bench"
          ]
        }
      },
      {
        "rarity": "legendary",
        "chance": 0.12,
        "rareBonus": 0.42,
        "requires": {
          "upgrades": [
            "watch_post"
          ]
        }
      },
      {
        "rarity": "anomalous",
        "chance": 0.038,
        "rareBonus": 0.2,
        "requires": {
          "secretProgress": 1
        }
      },
      {
        "rarity": "mythic",
        "chance": 0.02,
        "rareBonus": 0.12,
        "requires": {
          "flags": [
            "worldReveal"
          ]
        }
      }
    ],
    "bonusChance": 0.7,
    "rarityBias": {
      "rare": 0.03,
      "epic": 0.06,
      "legendary": 0.05
    },
    "requires": {
      "upgrades": [
        "watch_post",
        "crafting_bench"
      ]
    },
    "logLabel": "the sealed caches",
    "eventChance": 0.58
  }
];

export const SCAVENGE_SOURCES_BY_ID = Object.fromEntries(SCAVENGE_SOURCES.map((source) => [source.id, source]));
