import { SURVIVOR_ROLES, SURVIVOR_TRAITS } from "../data.js";
import { ENEMIES, FACTIONS, RADIO_INVESTIGATIONS, TRADER_OFFERS } from "../content.js";
import {
  canAfford,
  formatCost,
  getAvailableRadioInvestigations,
  getAvailableTraderChannels,
  getTraderOfferCost,
  hasItem,
} from "../engine.js";
import { getLeaderboardSnapshot, getLeaderboardState } from "../services/leaderboard.js";
import {
  actionButton,
  byId,
  getTutorialStep,
  renderCrewPressure,
  renderFactionStatus,
  renderLogPulse,
  renderMiniLog,
  renderSignalSpectrum,
  renderSplitPane,
  surfaceCard,
  tagList,
  renderAnomalyTrace,
} from "./shared.js";

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

export function renderSurvivorTab(state, derived, _isMobile = false) {
  const roster = [...state.survivors.roster].sort((left, right) => {
    const leftRole = left.role === "idle" ? "zz-idle" : left.role;
    const rightRole = right.role === "idle" ? "zz-idle" : right.role;
    return `${leftRole}-${left.name}`.localeCompare(`${rightRole}-${right.name}`);
  });
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

export function renderRadioTab(state, isMobile = false) {
  const availableInvestigations = getAvailableRadioInvestigations(state);
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
            ? `<div class="detail-list">${availableInvestigations.map((investigation) => `
                <div class="list-block compact-block ${state.radio.investigation === investigation.id ? "is-selected-plan" : ""}">
                  <div class="surface-head">
                    <h4>${investigation.label}</h4>
                    <span class="tag">${state.radio.traces[investigation.id] || 0}</span>
                  </div>
                  <div class="chip-row">${tagList([investigation.short, `milestones ${investigation.milestones.length}`])}</div>
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
              ${availableInvestigations.map((investigation) => `
                <div class="list-block compact-block ${state.radio.investigation === investigation.id ? "is-selected-plan" : ""}">
                  <div class="surface-head">
                    <h4>${investigation.label}</h4>
                    <span class="tag">${state.radio.traces[investigation.id] || 0}</span>
                  </div>
                  <div class="chip-row">${tagList([
                    investigation.short,
                    ...investigation.milestones.map((milestone) => state.radio.resolved.includes(milestone.id) ? `locked ${milestone.at}` : `at ${milestone.at}`),
                  ])}</div>
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

export function renderTradeTab(state, _isMobile = false) {
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

export function renderFactionTab(state, _isMobile = false) {
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

export function renderLeaderboardTab(state, isMobile = false) {
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

export function renderLogTab(state, isMobile = false) {
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

export function renderHelpTab(state, isMobile = false) {
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

export function renderSettingsTab(state, isMobile = false) {
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

export function renderCombatBanner(state) {
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
