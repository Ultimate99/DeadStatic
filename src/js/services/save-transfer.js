import { migrateState } from "../state.js";

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

export function encodeSaveState(state) {
  return `${SAVE_TRANSFER_PREFIX}${encodeUtf8(JSON.stringify(state))}`;
}

export function downloadSaveFile(state) {
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

export async function copySaveCode(state) {
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

export function importSaveFromCode(raw) {
  return parseImportedState(raw);
}

export async function importSaveFromFile(file) {
  if (!file) {
    throw new Error("No file selected.");
  }

  const text = await file.text();
  return parseImportedState(text);
}
