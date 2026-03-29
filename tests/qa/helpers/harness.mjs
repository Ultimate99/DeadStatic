import { SAVE_KEY } from "../../../src/js/data.js";

export const SEARCH_PATTERN = [0.2, 0.6, 0.3, 0.2, 0.55, 0.2, 0.1, 0.9, 0.3, 0.95];

export function withRandomSequence(values, fn) {
  const originalRandom = Math.random;
  let index = 0;
  Math.random = () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };

  try {
    return fn();
  } finally {
    Math.random = originalRandom;
  }
}

class MockClassList {
  constructor() {
    this.values = new Set();
  }

  add(...tokens) {
    tokens.forEach((token) => this.values.add(token));
  }

  remove(...tokens) {
    tokens.forEach((token) => this.values.delete(token));
  }

  toggle(token, force) {
    if (typeof force === "boolean") {
      if (force) {
        this.values.add(token);
      } else {
        this.values.delete(token);
      }
      return force;
    }

    if (this.values.has(token)) {
      this.values.delete(token);
      return false;
    }

    this.values.add(token);
    return true;
  }
}

class MockElement {
  constructor(id = "") {
    this.id = id;
    this.innerHTML = "";
    this.textContent = "";
    this.dataset = {};
    this.classList = new MockClassList();
  }
}

export function createBundleHarness(randomValues, options = {}) {
  const ids = [
    "autosave-status",
    "day-clock",
    "world-subtitle",
    "resource-bar",
    "condition-readout",
    "condition-bar",
    "summary-strip",
    "combat-banner",
    "tab-bar",
    "tab-content",
  ];
  const elements = new Map(ids.map((id) => [id, new MockElement(id)]));
  const bodyListeners = new Map();
  const body = new MockElement("body");
  body.addEventListener = (type, handler) => {
    bodyListeners.set(type, handler);
  };

  const document = {
    body,
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, new MockElement(id));
      }
      return elements.get(id);
    },
    querySelectorAll() {
      return [];
    },
  };

  const storage = new Map();
  if (options.initialSave) {
    storage.set(SAVE_KEY, JSON.stringify(options.initialSave));
  }
  const localStorage = {
    getItem(key) {
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem(key, value) {
      storage.set(key, String(value));
    },
    removeItem(key) {
      storage.delete(key);
    },
  };

  let randomIndex = 0;
  const math = Object.create(Math);
  math.random = () => {
    const value = randomValues[randomIndex % randomValues.length];
    randomIndex += 1;
    return value;
  };

  const window = {
    document,
    localStorage,
    setInterval() {
      return 1;
    },
    confirm() {
      return true;
    },
  };

  const context = {
    console,
    document,
    window,
    Math: math,
  };
  context.globalThis = context;
  window.Math = math;

  return {
    context,
    elements,
    bodyListeners,
  };
}
