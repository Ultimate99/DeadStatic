/* Generated during architecture split. */
export const UPGRADES = [
  {
    "id": "backpack",
    "name": "Backpack",
    "description": "Stitch scavenged cloth and straps into something worth carrying.",
    "verb": "Rig",
    "cost": {
      "scrap": 4,
      "cloth": 2
    },
    "requires": {
      "searches": 3
    },
    "effects": {
      "searchScrapMin": 1,
      "searchScrapMax": 1,
      "searchBonusRolls": 1
    }
  },
  {
    "id": "rusty_knife",
    "name": "Rusty Knife",
    "description": "Wrap a sharp shard, bind the handle, and call it honest work.",
    "verb": "Bind",
    "cost": {
      "scrap": 2,
      "parts": 1,
      "cloth": 1
    },
    "materials": {
      "sharp_metal": 1
    },
    "requires": {
      "searches": 4
    },
    "effects": {
      "attack": 1,
      "grantItems": {
        "rusty_knife": 1
      },
      "unlockSections": [
        "inventory"
      ]
    }
  },
  {
    "id": "shelter_stash",
    "name": "Shelter Stash",
    "description": "A corner that counts as ownership.",
    "verb": "Secure",
    "cost": {
      "scrap": 8,
      "cloth": 1
    },
    "requires": {
      "searches": 4
    },
    "effects": {
      "unlockSections": [
        "shelter"
      ],
      "discoverResources": [
        "food"
      ],
      "defense": 1
    }
  },
  {
    "id": "campfire",
    "name": "Campfire",
    "description": "A controlled glow beats a cold death.",
    "verb": "Assemble",
    "cost": {
      "scrap": 10,
      "fuel": 1,
      "cloth": 1
    },
    "requires": {
      "upgrades": [
        "shelter_stash"
      ],
      "burnUses": 1
    },
    "effects": {
      "burnCondition": 6,
      "defense": 1,
      "discoverResources": [
        "fuel"
      ],
      "unlockSections": [
        "shelter"
      ]
    }
  },
  {
    "id": "basic_barricade",
    "name": "Basic Barricade",
    "description": "It will not stop everything. It does not need to.",
    "verb": "Brace",
    "cost": {
      "scrap": 14,
      "parts": 2,
      "wire": 1
    },
    "requires": {
      "upgrades": [
        "shelter_stash"
      ]
    },
    "effects": {
      "defense": 2,
      "unlockSections": [
        "shelter"
      ]
    }
  },
  {
    "id": "first_aid_rag",
    "name": "First Aid Rag",
    "description": "A filthy medical miracle.",
    "cost": {
      "cloth": 1,
      "medicine": 1
    },
    "requires": {
      "searches": 5
    },
    "effects": {
      "grantItems": {
        "first_aid_rag": 1
      },
      "discoverResources": [
        "medicine"
      ]
    }
  },
  {
    "id": "food_search",
    "name": "Simple Food Search",
    "description": "Separate hunger from useful scrap before both kill you.",
    "cost": {
      "scrap": 8,
      "water": 1
    },
    "requires": {
      "upgrades": [
        "shelter_stash"
      ]
    },
    "effects": {
      "searchFoodChance": 0.12,
      "searchBonusRolls": 1
    }
  },
  {
    "id": "small_scavenge",
    "name": "Small Scavenging Runs",
    "description": "A cautious loop beyond line of sight.",
    "cost": {
      "scrap": 14,
      "food": 1
    },
    "requires": {
      "upgrades": [
        "backpack",
        "rusty_knife"
      ]
    },
    "effects": {
      "unlockSections": [
        "map"
      ],
      "unlockZones": [
        "ruined_street"
      ],
      "expeditionLootBonus": 0.04
    }
  },
  {
    "id": "food_crate",
    "name": "Food Storage",
    "description": "Enough order to keep hunger from winning by accounting.",
    "cost": {
      "scrap": 16,
      "parts": 3,
      "cloth": 1
    },
    "requires": {
      "upgrades": [
        "food_search"
      ]
    },
    "effects": {
      "passive": {
        "food": 0.03
      },
      "discoverResources": [
        "food"
      ]
    }
  },
  {
    "id": "crafting_bench",
    "name": "Crafting Bench",
    "description": "The first place built for making instead of hiding.",
    "cost": {
      "scrap": 20,
      "parts": 5,
      "wire": 1
    },
    "requires": {
      "upgrades": [
        "small_scavenge"
      ]
    },
    "effects": {
      "searchPartChance": 0.08,
      "rareLootBonus": 0.08,
      "unlockSections": [
        "inventory"
      ]
    }
  },
  {
    "id": "weapon_rack",
    "name": "Weapon Slot",
    "description": "A proper place for a proper answer.",
    "cost": {
      "scrap": 24,
      "parts": 4
    },
    "requires": {
      "upgrades": [
        "crafting_bench"
      ]
    },
    "effects": {
      "weaponSlot": true,
      "unlockSections": [
        "inventory"
      ],
      "attack": 1
    }
  },
  {
    "id": "armor_hooks",
    "name": "Armor Slot",
    "description": "A wall of hooks for whatever passes as protection now.",
    "cost": {
      "scrap": 24,
      "parts": 4
    },
    "requires": {
      "upgrades": [
        "crafting_bench"
      ]
    },
    "effects": {
      "armorSlot": true,
      "unlockSections": [
        "inventory"
      ],
      "defense": 1
    }
  },
  {
    "id": "watch_post",
    "name": "Watch Post",
    "description": "Higher eyes make the nights shorter.",
    "cost": {
      "scrap": 28,
      "parts": 5,
      "wire": 1
    },
    "requires": {
      "upgrades": [
        "basic_barricade"
      ]
    },
    "effects": {
      "defense": 3,
      "survivorCap": 1,
      "passive": {
        "reputation": 0.02
      }
    }
  },
  {
    "id": "ammo_press",
    "name": "Ammo Press",
    "description": "No bullets appear on purpose by accident.",
    "cost": {
      "scrap": 30,
      "parts": 8,
      "chemicals": 2
    },
    "requires": {
      "upgrades": [
        "crafting_bench"
      ]
    },
    "effects": {
      "discoverResources": [
        "ammo"
      ],
      "passive": {
        "ammo": 0.015
      }
    }
  },
  {
    "id": "rain_collector",
    "name": "Rain Collector",
    "description": "A cleaner mouthful than the old pipes.",
    "cost": {
      "scrap": 18,
      "parts": 4,
      "cloth": 2,
      "wire": 1
    },
    "requires": {
      "upgrades": [
        "shelter_stash"
      ]
    },
    "effects": {
      "conditionRegen": 0.02,
      "passive": {
        "water": 0.05
      }
    }
  },
  {
    "id": "radio_rig",
    "name": "Radio",
    "description": "The dead city still has a voice.",
    "cost": {
      "scrap": 26,
      "parts": 8,
      "wire": 4,
      "electronics": 2,
      "fuel": 2
    },
    "requires": {
      "upgrades": [
        "watch_post"
      ]
    },
    "effects": {
      "unlockSections": [
        "radio"
      ],
      "radioDepth": 0.4,
      "discoverResources": [
        "reputation"
      ]
    }
  },
  {
    "id": "map_board",
    "name": "Map",
    "description": "A wall of routes, guesses, and exits that failed.",
    "cost": {
      "scrap": 24,
      "parts": 4,
      "cloth": 1
    },
    "requires": {
      "upgrades": [
        "small_scavenge"
      ]
    },
    "effects": {
      "unlockSections": [
        "map"
      ],
      "unlockZones": [
        "burned_apartments",
        "abandoned_gas_station"
      ]
    }
  },
  {
    "id": "survivor_cots",
    "name": "Survivor Recruitment",
    "description": "A second mattress is a public statement.",
    "cost": {
      "scrap": 24,
      "food": 3,
      "water": 2,
      "cloth": 2
    },
    "requires": {
      "upgrades": [
        "food_crate"
      ]
    },
    "effects": {
      "unlockSections": [
        "survivors"
      ],
      "discoverResources": [
        "morale"
      ],
      "survivorCap": 2
    }
  },
  {
    "id": "smokehouse",
    "name": "Smokehouse",
    "description": "A shelter that smells like tomorrow.",
    "cost": {
      "scrap": 32,
      "parts": 6,
      "fuel": 3,
      "cloth": 1
    },
    "requires": {
      "upgrades": [
        "food_crate"
      ]
    },
    "effects": {
      "passive": {
        "food": 0.05,
        "water": 0.02,
        "morale": 0.01
      }
    }
  },
  {
    "id": "trader_beacon",
    "name": "Trader Beacon",
    "description": "A coded light that says you are worth visiting.",
    "cost": {
      "scrap": 34,
      "parts": 8,
      "wire": 3,
      "fuel": 4
    },
    "requires": {
      "upgrades": [
        "radio_rig"
      ]
    },
    "effects": {
      "unlockSections": [
        "trader"
      ],
      "passive": {
        "reputation": 0.02
      }
    }
  },
  {
    "id": "scout_bike",
    "name": "Scout Bike",
    "description": "Fast enough to be reckless on purpose.",
    "cost": {
      "scrap": 42,
      "parts": 12,
      "fuel": 6,
      "electronics": 1
    },
    "requires": {
      "upgrades": [
        "map_board"
      ]
    },
    "effects": {
      "unlockZones": [
        "flooded_tunnel",
        "hospital_wing"
      ],
      "expeditionLootBonus": 0.12,
      "scoutBonus": 0.08
    }
  },
  {
    "id": "signal_decoder",
    "name": "Signal Decoder",
    "description": "Translates the hiss into intent.",
    "cost": {
      "scrap": 44,
      "parts": 12,
      "wire": 3,
      "electronics": 3,
      "relics": 1
    },
    "requires": {
      "upgrades": [
        "radio_rig"
      ],
      "radioProgress": 2
    },
    "effects": {
      "radioDepth": 0.8,
      "secretProgress": 1
    }
  },
  {
    "id": "auto_scavenger",
    "name": "Auto Scavenger",
    "description": "A dumb rig that can still find bright metal.",
    "cost": {
      "scrap": 50,
      "parts": 14,
      "wire": 3,
      "fuel": 5
    },
    "requires": {
      "upgrades": [
        "survivor_cots",
        "watch_post"
      ]
    },
    "effects": {
      "passive": {
        "scrap": 0.11,
        "parts": 0.04
      }
    }
  },
  {
    "id": "faraday_mesh",
    "name": "Faraday Mesh",
    "description": "Wire the walls before the walls start listening back.",
    "cost": {
      "scrap": 56,
      "parts": 16,
      "wire": 6,
      "electronics": 1,
      "relics": 1
    },
    "requires": {
      "upgrades": [
        "signal_decoder"
      ]
    },
    "effects": {
      "defense": 4,
      "conditionRegen": 0.05
    }
  },
  {
    "id": "relay_tap",
    "name": "Relay Tap",
    "description": "Steal power from a signal that never asked permission.",
    "cost": {
      "scrap": 58,
      "parts": 18,
      "wire": 6,
      "electronics": 3,
      "fuel": 8
    },
    "requires": {
      "upgrades": [
        "trader_beacon"
      ],
      "radioProgress": 4
    },
    "effects": {
      "passive": {
        "fuel": 0.07,
        "parts": 0.03
      },
      "radioDepth": 0.6
    }
  },
  {
    "id": "bunker_drill",
    "name": "Bunker Drill",
    "description": "Something under the city was not meant to open easily.",
    "cost": {
      "scrap": 68,
      "parts": 18,
      "wire": 4,
      "fuel": 10,
      "relics": 2
    },
    "requires": {
      "upgrades": [
        "signal_decoder"
      ],
      "secretProgress": 2
    },
    "effects": {
      "unlockZones": [
        "hidden_bunker_entrance"
      ],
      "secretProgress": 1
    }
  }
];

export const UPGRADES_BY_ID = Object.fromEntries(UPGRADES.map((upgrade) => [upgrade.id, upgrade]));
