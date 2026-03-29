import { SURVIVOR_ROLES } from "../data.js";
import { ENEMIES, FACTIONS, TRADER_OFFERS } from "../content.js";
import { canAfford, formatCost, hasItem } from "../engine.js";
import { getLeaderboardSnapshot, getLeaderboardState } from "../services/leaderboard.js";
import {
  actionButton,
  byId,
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

function renderLeaderboardPanel(state) {
  const remote = getLeaderboardState();
  const snapshot = getLeaderboardSnapshot(state);
  const usernameReady = remote.profile.codename && remote.profile.codename.length >= 3;
  const statusLabel = {
    disabled: "offline",
    idle: "ready",
    loading: "syncing",
    ready: "synced",
    error: "error",
  }[remote.status] || remote.status;

  return `
    <div class="detail-list leaderboard-board">
      <div class="list-block leaderboard-summary">
        <div class="surface-head">
          <div>
            <span class="note-label">Current run</span>
            <h4>${usernameReady ? remote.profile.codename : "No username"}</h4>
          </div>
          <span class="tag">${snapshot.summary.score}</span>
        </div>
        <div class="fact-grid">
          <div class="fact"><span>Stage</span><strong>${snapshot.summary.stage}</strong></div>
          <div class="fact"><span>Nights</span><strong>${snapshot.summary.nightsSurvived}</strong></div>
          <div class="fact"><span>Zones</span><strong>${snapshot.summary.zonesVisited}</strong></div>
          <div class="fact"><span>Signal</span><strong>${snapshot.summary.radioProgress}</strong></div>
        </div>
      </div>
      <div class="action-stack leaderboard-actions">
        ${actionButton({
          action: "set-callsign",
          label: usernameReady ? "Edit username" : "Set username",
          meta: usernameReady ? remote.profile.codename : "3-24 characters",
          variant: "compact",
          icon: "ID",
        })}
        ${actionButton({
          action: "refresh-leaderboard",
          label: "Refresh board",
          meta: remote.enabled ? "pull ranks" : "backend off",
          variant: "compact",
          disabled: !remote.enabled,
          icon: "LB",
        })}
        ${actionButton({
          action: "submit-leaderboard",
          label: "Submit run",
          meta: remote.enabled ? (usernameReady ? "upload best" : "set username") : "backend off",
          variant: "primary compact",
          disabled: !remote.enabled || !usernameReady || remote.submitStatus === "submitting",
          icon: "UP",
        })}
      </div>
      <div class="list-block leaderboard-status">
        <div class="surface-head">
          <h4>Board status</h4>
          <span class="tag">${statusLabel}</span>
        </div>
        <p class="note">${remote.message || (remote.lastUpdated ? `Last sync ${remote.lastUpdated}` : "Hosted board idle.")}</p>
      </div>
      ${remote.entries.length ? `
        <div class="detail-list leaderboard-list">
          ${remote.entries.map((entry) => `
            <div class="list-block leaderboard-row ${entry.playerId === remote.profile.playerId ? "is-self" : ""}">
              <div class="surface-head">
                <div class="leaderboard-rankline">
                  <span class="leaderboard-rank">#${entry.rank}</span>
                  <h4>${entry.playerName}</h4>
                </div>
                <span class="tag">${entry.score}</span>
              </div>
              <div class="chip-row">${tagList([
                entry.stage,
                `${entry.nights} nights`,
                `${entry.zones} zones`,
                `${entry.radio} signal`,
                entry.playerId === remote.profile.playerId ? "you" : null,
              ].filter(Boolean))}</div>
            </div>
          `).join("")}
        </div>
      ` : `<p class="empty-state">${remote.enabled ? "No hosted runs yet. Submit the first one." : "Leaderboard is disabled until the hosted backend is configured."}</p>`}
    </div>
  `;
}

export function renderLeaderboardTab(state) {
  return renderSplitPane(
    [
      surfaceCard({
        title: "Global leaderboard",
        meta: getLeaderboardState().entries.length ? `${getLeaderboardState().entries.length} ranked` : "hosted",
        body: renderLeaderboardPanel(state),
      }),
    ],
    [
      surfaceCard({
        title: "Save transfer",
        meta: "phone + desktop",
        body: renderSaveTransferPanel(),
      }),
      surfaceCard({
        title: "Recent feed",
        meta: `${Math.min(8, state.log.length)} latest`,
        body: renderMiniLog(state.log, 8),
      }),
    ],
    "tab-columns-log"
  );
}

function renderSaveTransferPanel() {
  return `
    <div class="detail-list transfer-board">
      <div class="list-block transfer-copy">
        <div class="surface-head">
          <div>
            <span class="note-label">Cross-device save</span>
            <h4>Move your run</h4>
          </div>
          <span class="tag">local</span>
        </div>
        <div class="chip-row">${tagList(["file backup", "share code", "phone -> desktop"])}</div>
      </div>
      <div class="action-stack transfer-actions">
        ${actionButton({
          action: "download-save-file",
          label: "Download save file",
          meta: "json backup",
          variant: "compact",
          icon: "SV",
        })}
        ${actionButton({
          action: "copy-save-code",
          label: "Copy save code",
          meta: "portable text code",
          variant: "compact",
          icon: "CP",
        })}
        ${actionButton({
          action: "trigger-save-import",
          label: "Import save file",
          meta: "load json backup",
          variant: "compact",
          icon: "IN",
        })}
        ${actionButton({
          action: "import-save-code",
          label: "Paste save code",
          meta: "restore from text",
          variant: "compact",
          icon: "CD",
        })}
      </div>
    </div>
  `;
}

export function renderSurvivorTab(state, derived) {
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
                <div class="chip-row">${tagList([role.description])}</div>
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
              meta: "18 scrap / 3 food",
              disabled: state.survivors.total >= derived.survivorCap || !canAfford(state, { scrap: 18, food: 3 }),
              icon: "+1",
            })}
          </div>
        `,
      }),
      surfaceCard({
        title: "Crew pressure",
        meta: `${state.survivors.idle} idle`,
        body: renderCrewPressure(state),
      }),
    ],
    "tab-columns-crew"
  );
}

export function renderRadioTab(state) {
  const notes = [];
  if (state.story.radioProgress === 0) {
    notes.push("The band is mostly ghost noise. Keep feeding the rig.");
  }
  if (state.story.radioProgress >= 2) {
    notes.push("Underground routes and hospital traffic start surfacing in fragments.");
  }
  if (state.story.radioProgress >= 4) {
    notes.push("The signal stops feeling archival and starts feeling active.");
  }
  if (state.flags.bunkerRouteKnown) {
    notes.push("A bunker route now sits behind the static, waiting for proof and nerve.");
  }
  if (state.flags.worldReveal) {
    notes.push("You know the name behind the pattern now. Dead Static was built, not born.");
  }

  return renderSplitPane(
    [
      surfaceCard({
        title: "Transmission notes",
        meta: `${notes.length} threads`,
        body: notes.length
          ? `<div class="detail-list">${notes.map((note, index) => `<div class="list-block signal-note-card"><div class="surface-head"><h4>Trace ${String(index + 1).padStart(2, "0")}</h4><span class="tag">rx</span></div><div class="chip-row">${tagList([note])}</div></div>`).join("")}</div>`
          : `<p class="empty-state">Nothing legible yet.</p>`,
      }),
      surfaceCard({
        title: "Signal chain",
        meta: `${notes.length} clues`,
        body: `
          <div class="detail-list">
            <div class="list-block">
              <div class="surface-head">
                <h4>Band state</h4>
                <span class="tag">${state.flags.worldReveal ? "open" : "partial"}</span>
              </div>
              <div class="chip-row">${tagList([state.story.radioProgress > 0 ? "structured noise" : "mostly hiss"])}</div>
            </div>
            <div class="list-block">
              <div class="surface-head">
                <h4>Route hooks</h4>
                <span class="tag">${state.flags.bunkerRouteKnown ? "marked" : "hidden"}</span>
              </div>
              <div class="chip-row">${tagList([state.flags.bunkerRouteKnown ? "bunker line marked" : "scan deeper"])}</div>
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
          <div class="spacer-top">
            ${actionButton({
              action: "scan-radio",
              label: "Sweep band",
              meta: "1 fuel / 1 parts",
              disabled: state.resources.fuel < 1 || state.resources.parts < 1,
              icon: "RX",
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

export function renderTradeTab(state) {
  const offers = state.trader.offers
    .map((offerId) => TRADER_OFFERS.find((offer) => offer.id === offerId))
    .filter(Boolean);

  return renderSplitPane(
    [
      surfaceCard({
        title: "Offer wall",
        meta: offers.length ? "trade window" : "quiet",
        body: offers.length
          ? `<div class="offer-grid">${offers.map((offer) => `
            <div class="list-block trade-offer-card">
              <div class="surface-head">
                <h4>${offer.name}</h4>
                <span class="tag">${formatCost(offer.cost)}</span>
              </div>
              <div class="chip-row">${tagList([offer.description])}</div>
              ${actionButton({
                action: "buy-offer",
                label: "Trade",
                meta: "Take the deal",
                disabled: !canAfford(state, offer.cost),
                data: { offer: offer.id },
                icon: "TR",
              })}
            </div>
          `).join("")}</div>`
          : `<p class="empty-state">No one is haggling with you right now.</p>`,
      }),
    ],
    [
      surfaceCard({
        title: "Market board",
        meta: `${offers.length} live`,
        body: `
          <div class="fact-grid">
            <div class="fact"><span>Scrap</span><strong>${state.resources.scrap}</strong></div>
            <div class="fact"><span>Reputation</span><strong>${state.resources.reputation}</strong></div>
            <div class="fact"><span>Fuel</span><strong>${state.resources.fuel}</strong></div>
            <div class="fact"><span>Medicine</span><strong>${state.resources.medicine}</strong></div>
          </div>
          <div class="spacer-top">
            ${actionButton({
              action: "refresh-trader",
              label: "Refresh offers",
              meta: "new wall",
              icon: "TR",
            })}
          </div>
        `,
      }),
    ],
    "tab-columns-trade"
  );
}

export function renderFactionTab(state) {
  return renderSplitPane(
    [
      `<div class="tab-inline-grid faction-grid">
        ${FACTIONS.map((faction) => surfaceCard({
          title: faction.name,
          meta: state.faction.aligned === faction.id ? "aligned" : "available",
          className: "faction-card",
          body: `
            <div class="chip-row">${tagList([faction.description, ...faction.bonuses])}</div>
            ${actionButton({
              action: "choose-faction",
              label: state.faction.aligned === faction.id ? "Aligned" : `Align with ${faction.name}`,
              meta: "locks choice",
              disabled: Boolean(state.faction.aligned),
              data: { faction: faction.id },
              icon: "FX",
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

export function renderLogTab(state) {
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
        <div class="action-row">
          ${actionButton({
            action: "combat-attack",
            label: "Attack",
            meta: "Commit",
            variant: "primary compact",
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
