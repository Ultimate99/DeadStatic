/* Generated during architecture split. */
export const SEARCH_EVENTS = [
  {
    "id": "search_broken_meter",
    "pool": "search",
    "weight": 10,
    "text": "A broken parking meter gives up a fistful of coins and screws.",
    "effects": {
      "resources": {
        "scrap": 2
      }
    }
  },
  {
    "id": "search_soup_tin",
    "pool": "search",
    "weight": 8,
    "text": "Under cracked plaster: a dented tin with something that still counts as food.",
    "effects": {
      "resources": {
        "food": 1
      },
      "discoverResources": [
        "food"
      ]
    }
  },
  {
    "id": "search_loose_copper",
    "pool": "search",
    "weight": 7,
    "text": "A wall peels back and exposes copper the city forgot to protect.",
    "effects": {
      "resources": {
        "wire": 1,
        "parts": 1
      },
      "discoverResources": [
        "wire",
        "parts"
      ]
    }
  },
  {
    "id": "search_alarm",
    "pool": "search",
    "weight": 6,
    "text": "An old alarm screams once when you move the rubble. So do you.",
    "effects": {
      "resources": {
        "scrap": 1
      },
      "condition": -3
    }
  },
  {
    "id": "search_blanket",
    "pool": "search",
    "weight": 6,
    "text": "Half a burnt blanket and a lighter. Good enough for a colder plan.",
    "effects": {
      "resources": {
        "fuel": 1,
        "cloth": 1
      },
      "discoverResources": [
        "fuel",
        "cloth"
      ]
    }
  },
  {
    "id": "search_clinic_token",
    "pool": "search",
    "weight": 5,
    "text": "A clinic drawer gives you alcohol wipes and a shiver.",
    "effects": {
      "resources": {
        "medicine": 1
      },
      "discoverResources": [
        "medicine"
      ]
    }
  },
  {
    "id": "search_torn_canvas",
    "pool": "search",
    "weight": 5,
    "text": "A bus seat tears clean. The cloth and straps survive better than the passengers did.",
    "effects": {
      "resources": {
        "cloth": 2
      },
      "discoverResources": [
        "cloth"
      ]
    }
  },
  {
    "id": "search_sharp_metal",
    "pool": "search",
    "weight": 5,
    "text": "A bent road sign snaps along a clean edge. One side is suddenly useful.",
    "effects": {
      "grantItems": {
        "sharp_metal": 1
      }
    }
  },
  {
    "id": "search_satchel",
    "pool": "search",
    "weight": 4,
    "text": "A school satchel survives with one unopened can inside.",
    "effects": {
      "grantItems": {
        "canned_beans": 1
      }
    }
  },
  {
    "id": "search_funny_poster",
    "pool": "search",
    "weight": 4,
    "text": "You find a poster that says STAY CALM in six torn pieces. Funny enough.",
    "effects": {
      "condition": 1
    }
  },
  {
    "id": "search_transistor",
    "pool": "search",
    "weight": 3,
    "text": "A pocket transistor spits a second of speech before dying again.",
    "effects": {
      "resources": {
        "parts": 1,
        "electronics": 1
      },
      "radioProgress": 1,
      "discoverResources": [
        "parts",
        "electronics"
      ]
    }
  },
  {
    "id": "search_neighbor",
    "pool": "search",
    "weight": 3,
    "text": "A dead neighbor still has a keyring and a note that says 'don't trust the tower'.",
    "effects": {
      "resources": {
        "scrap": 1,
        "parts": 1
      },
      "discoverResources": [
        "parts"
      ]
    }
  }
];
