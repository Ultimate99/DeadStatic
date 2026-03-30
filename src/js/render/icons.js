const ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  overview: `
    <rect x="4" y="4" width="7" height="7" rx="1.5"></rect>
    <rect x="13" y="4" width="7" height="4" rx="1.5"></rect>
    <rect x="13" y="10" width="7" height="10" rx="1.5"></rect>
    <rect x="4" y="13" width="7" height="7" rx="1.5"></rect>
  `,
  player: `
    <circle cx="12" cy="8" r="3"></circle>
    <path d="M6.5 19a5.5 5.5 0 0 1 11 0"></path>
    <path d="M17 6.5 19.5 9 17 11.5"></path>
  `,
  craft: `
    <path d="M7 18l10-10"></path>
    <path d="M14 5l5 5"></path>
    <path d="M5 14l5 5"></path>
    <path d="M6 6l3 3"></path>
  `,
  inventory: `
    <path d="M8 8V6a4 4 0 0 1 8 0v2"></path>
    <path d="M6 8h12l1 10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L6 8Z"></path>
    <path d="M9 12h6"></path>
  `,
  shelter: `
    <path d="M4 11.5 12 5l8 6.5"></path>
    <path d="M6 10.5V20h12v-9.5"></path>
    <path d="M10 20v-5h4v5"></path>
  `,
  shelter_map: `
    <path d="M4 6.5 9.5 4l5 2.5L20 4v13.5L14.5 20 9.5 17.5 4 20V6.5Z"></path>
    <path d="M9.5 4v13.5"></path>
    <path d="M14.5 6.5V20"></path>
  `,
  map: `
    <circle cx="7" cy="8" r="2.2"></circle>
    <circle cx="17" cy="16" r="2.2"></circle>
    <path d="M8.8 9.6 12 12.2"></path>
    <path d="M14.2 13.9 15.2 14.8"></path>
    <path d="M12 6.5h6"></path>
  `,
  crew: `
    <circle cx="9" cy="9" r="3"></circle>
    <circle cx="16.5" cy="10.5" r="2.5"></circle>
    <path d="M4.5 19a4.5 4.5 0 0 1 9 0"></path>
    <path d="M13.5 19a3.5 3.5 0 0 1 7 0"></path>
  `,
  radio: `
    <path d="M6 18h12"></path>
    <path d="M12 18V8"></path>
    <path d="M8.5 14.5a4.5 4.5 0 0 1 0-7"></path>
    <path d="M15.5 7.5a4.5 4.5 0 0 1 0 7"></path>
    <path d="M6.2 17.8 7.5 11"></path>
    <path d="M17.8 17.8 16.5 11"></path>
  `,
  trade: `
    <path d="M7 7h10"></path>
    <path d="M7 12h10"></path>
    <path d="M7 17h10"></path>
    <path d="M14 5l3 2-3 2"></path>
    <path d="M10 10 7 12l3 2"></path>
    <path d="M14 15l3 2-3 2"></path>
  `,
  factions: `
    <circle cx="12" cy="5.5" r="2.2"></circle>
    <circle cx="6.5" cy="17" r="2.2"></circle>
    <circle cx="17.5" cy="17" r="2.2"></circle>
    <path d="M10.7 7.3 7.8 14.9"></path>
    <path d="M13.3 7.3 16.2 14.9"></path>
    <path d="M8.8 17h6.4"></path>
  `,
  leaderboard: `
    <path d="M8 18h8"></path>
    <path d="M9.5 18v-3h5v3"></path>
    <path d="M8 5h8v3a4 4 0 0 1-8 0V5Z"></path>
    <path d="M8 7H5.5a2 2 0 0 0 2 2"></path>
    <path d="M16 7h2.5a2 2 0 0 1-2 2"></path>
  `,
  log: `
    <path d="M7 5h10"></path>
    <path d="M7 10h10"></path>
    <path d="M7 15h7"></path>
    <path d="M5 5h.01"></path>
    <path d="M5 10h.01"></path>
    <path d="M5 15h.01"></path>
  `,
  warmth: `
    <path d="M12 4c1.5 2 3.5 3.8 3.5 6.7a3.5 3.5 0 0 1-7 0C8.5 8.2 10.2 6.6 12 4Z"></path>
    <path d="M10.5 13c.2 1 1 2 1.5 2.5.5-.5 1.3-1.5 1.5-2.5"></path>
  `,
  threat: `
    <path d="M12 4 4.5 18h15L12 4Z"></path>
    <path d="M12 9v4.5"></path>
    <path d="M12 17h.01"></path>
  `,
  noise: `
    <path d="M5 14h2l3 3V7L7 10H5v4Z"></path>
    <path d="M14 9a4 4 0 0 1 0 6"></path>
    <path d="M16.5 6.5a7.5 7.5 0 0 1 0 11"></path>
  `,
  food: `
    <path d="M8 5v6"></path>
    <path d="M10 5v6"></path>
    <path d="M8 8h2"></path>
    <path d="M14.5 5v14"></path>
    <path d="M14.5 5c2 0 3.5 2 3.5 4.5S16.5 14 14.5 14"></path>
  `,
  water: `
    <path d="M12 4c2.4 3 5 5.8 5 9a5 5 0 0 1-10 0c0-3.2 2.6-6 5-9Z"></path>
  `,
  scrap: `
    <path d="M7 6h4l1.5 2.5L10 12H6.5L5 9.5 7 6Z"></path>
    <path d="M14 11h4l1 2-1 2h-4l-1-2 1-2Z"></path>
    <path d="M9 14l2 3h4"></path>
  `,
  cloth: `
    <path d="M7 5h10l2 4-3 2v8H8v-8L5 9l2-4Z"></path>
    <path d="M10 11h4"></path>
  `,
  fuel: `
    <path d="M9 5h6v14H9z"></path>
    <path d="M15 8h2l2 2v5a2 2 0 0 1-2 2h-2"></path>
    <path d="M11 9h2"></path>
  `,
  parts: `
    <circle cx="12" cy="12" r="2.2"></circle>
    <path d="M12 4v3"></path>
    <path d="M12 17v3"></path>
    <path d="m5.6 7.1 2.1 2.1"></path>
    <path d="m16.3 17.8 2.1 2.1"></path>
    <path d="M4 12h3"></path>
    <path d="M17 12h3"></path>
    <path d="m5.6 16.9 2.1-2.1"></path>
    <path d="m16.3 6.2 2.1-2.1"></path>
  `,
  wire: `
    <path d="M7 6v6a3 3 0 0 0 6 0V8a2 2 0 0 1 4 0v10"></path>
    <path d="M17 18h2"></path>
  `,
  medicine: `
    <path d="M10 5h4v4h4v4h-4v4h-4v-4H6V9h4V5Z"></path>
  `,
  ammo: `
    <path d="M9 5h6"></path>
    <path d="M10 5v12a2 2 0 0 0 4 0V5"></path>
    <path d="M10 9h4"></path>
  `,
  electronics: `
    <rect x="7" y="7" width="10" height="10" rx="2"></rect>
    <path d="M10 4v3"></path>
    <path d="M14 4v3"></path>
    <path d="M10 17v3"></path>
    <path d="M14 17v3"></path>
    <path d="M4 10h3"></path>
    <path d="M17 10h3"></path>
    <path d="M4 14h3"></path>
    <path d="M17 14h3"></path>
  `,
  chemicals: `
    <path d="M10 5v5l-4 7a2 2 0 0 0 1.7 3h8.6a2 2 0 0 0 1.7-3l-4-7V5"></path>
    <path d="M9 5h6"></path>
    <path d="M9 12h6"></path>
  `,
  morale: `
    <path d="M12 19c-5-2.8-7-5.5-7-8.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5c0 3-2 5.7-7 8.5Z"></path>
  `,
  reputation: `
    <circle cx="12" cy="8" r="3"></circle>
    <path d="M7 19h10"></path>
    <path d="M9 14h6v5H9z"></path>
  `,
  relics: `
    <path d="M12 4 7 9l5 11 5-11-5-5Z"></path>
    <path d="M9 9h6"></path>
  `,
  search: `
    <circle cx="11" cy="11" r="5"></circle>
    <path d="m16 16 4 4"></path>
  `,
  scavenge: `
    <path d="M6 18 18 6"></path>
    <path d="M9 6h9v9"></path>
    <path d="M6 9v9h9"></path>
  `,
  build: `
    <path d="M12 5v14"></path>
    <path d="M5 12h14"></path>
    <path d="M8 8h8v8H8z"></path>
  `,
  route: `
    <path d="M6 18c3-6 9-4 12-10"></path>
    <circle cx="6" cy="18" r="2"></circle>
    <circle cx="18" cy="8" r="2"></circle>
  `,
  launch: `
    <path d="M12 4 18 10l-5 1 1 5-2 4-2-4 1-5-5-1 6-6Z"></path>
  `,
  gear: `
    <path d="M8 7h8l1 4-5 8-5-8 1-4Z"></path>
    <path d="M10 7V5h4v2"></path>
  `,
  use: `
    <path d="M6 12h6"></path>
    <path d="m10 8 4 4-4 4"></path>
    <rect x="4" y="6" width="16" height="12" rx="2"></rect>
  `,
  recruit: `
    <circle cx="10" cy="9" r="3"></circle>
    <path d="M5.5 19a4.5 4.5 0 0 1 9 0"></path>
    <path d="M18 8v6"></path>
    <path d="M15 11h6"></path>
  `,
  sync: `
    <path d="M7 8a6 6 0 0 1 10.4-2"></path>
    <path d="m17 4 .4 3.8L13.6 8"></path>
    <path d="M17 16A6 6 0 0 1 6.6 18"></path>
    <path d="m7 20-.4-3.8L10.4 16"></path>
  `,
  upload: `
    <path d="M12 16V6"></path>
    <path d="m8 10 4-4 4 4"></path>
    <path d="M6 18h12"></path>
  `,
  username: `
    <circle cx="12" cy="8.5" r="3"></circle>
    <path d="M6 19a6 6 0 0 1 12 0"></path>
  `,
  save_file: `
    <path d="M7 4h8l3 3v13H7z"></path>
    <path d="M15 4v5h5"></path>
    <path d="M10 13h4"></path>
    <path d="M10 17h4"></path>
  `,
  copy: `
    <rect x="9" y="9" width="9" height="11" rx="2"></rect>
    <path d="M6 15H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v1"></path>
  `,
  load_file: `
    <path d="M7 4h8l3 3v13H7z"></path>
    <path d="M15 4v5h5"></path>
    <path d="M12 18v-8"></path>
    <path d="m8 14 4 4 4-4"></path>
  `,
  code: `
    <path d="m8 8-4 4 4 4"></path>
    <path d="m16 8 4 4-4 4"></path>
    <path d="m13 5-2 14"></path>
  `,
  barricade: `
    <path d="M6 18h12"></path>
    <path d="M8 18 6.5 8h3L11 18"></path>
    <path d="M16 18l1.5-10h-3L13 18"></path>
    <path d="M7 12h10"></path>
  `,
  night: `
    <path d="M15.5 4.5a7 7 0 1 0 4 10.5 6 6 0 0 1-4-10.5Z"></path>
    <path d="M9 5.5h.01"></path>
  `,
  heal: `
    <path d="M12 6v12"></path>
    <path d="M6 12h12"></path>
    <circle cx="12" cy="12" r="7"></circle>
  `,
  retreat: `
    <path d="M18 12H7"></path>
    <path d="m11 8-4 4 4 4"></path>
  `,
  combat: `
    <path d="M7 7l10 10"></path>
    <path d="M17 7 7 17"></path>
  `,
  generic: `
    <circle cx="12" cy="12" r="5"></circle>
  `,
};

export function iconMarkup(name = "generic") {
  const body = ICONS[name] || ICONS.generic;
  return `<svg class="ui-icon-svg" ${ATTRS} aria-hidden="true">${body}</svg>`;
}
