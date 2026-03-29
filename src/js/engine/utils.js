export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function chance(probability) {
  return Math.random() < probability;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function pickOne(list) {
  return list.length ? list[randInt(0, list.length - 1)] : null;
}

export function hourStamp(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}
