export function stateMeetsRequirements(state, requirements = {}, hasItem = () => false) {
  if (requirements.searches && state.stats.searches < requirements.searches) {
    return false;
  }
  if (requirements.burnUses && state.stats.burnUses < requirements.burnUses) {
    return false;
  }
  if (requirements.day && state.time.day < requirements.day) {
    return false;
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    return false;
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    return false;
  }
  if (requirements.survivors && state.survivors.total < requirements.survivors) {
    return false;
  }
  if (requirements.zonesVisited && state.stats.zonesVisited < requirements.zonesVisited) {
    return false;
  }
  if (requirements.reputation && state.resources.reputation < requirements.reputation) {
    return false;
  }
  if (requirements.upgrades && !requirements.upgrades.every((upgradeId) => state.upgrades.includes(upgradeId))) {
    return false;
  }
  if (requirements.items && !requirements.items.every((itemId) => hasItem(state, itemId))) {
    return false;
  }
  if (requirements.flags && !requirements.flags.every((flag) => state.flags[flag])) {
    return false;
  }

  return true;
}

export function listRequirementGaps(
  state,
  requirements = {},
  {
    hasItem = () => false,
    labelForUpgrade = (upgradeId) => upgradeId,
    labelForItem = (itemId) => itemId,
  } = {},
) {
  const notes = [];

  if (requirements.searches && state.stats.searches < requirements.searches) {
    notes.push(`${requirements.searches - state.stats.searches} searches`);
  }
  if (requirements.burnUses && state.stats.burnUses < requirements.burnUses) {
    notes.push(`${requirements.burnUses - state.stats.burnUses} warmth burns`);
  }
  if (requirements.day && state.time.day < requirements.day) {
    notes.push(`day ${requirements.day}`);
  }
  if (requirements.radioProgress && state.story.radioProgress < requirements.radioProgress) {
    notes.push(`signal ${requirements.radioProgress}`);
  }
  if (requirements.secretProgress && state.story.secretProgress < requirements.secretProgress) {
    notes.push(`secret ${requirements.secretProgress}`);
  }
  if (requirements.survivors && state.survivors.total < requirements.survivors) {
    notes.push(`${requirements.survivors - state.survivors.total} crew`);
  }
  if (requirements.reputation && state.resources.reputation < requirements.reputation) {
    notes.push(`rep ${requirements.reputation}`);
  }
  if (requirements.upgrades) {
    const missingUpgrades = requirements.upgrades
      .filter((upgradeId) => !state.upgrades.includes(upgradeId))
      .map((upgradeId) => labelForUpgrade(upgradeId));

    if (missingUpgrades.length) {
      notes.push(missingUpgrades.join(" + "));
    }
  }
  if (requirements.items) {
    const missingItems = requirements.items
      .filter((itemId) => !hasItem(state, itemId))
      .map((itemId) => labelForItem(itemId));

    if (missingItems.length) {
      notes.push(missingItems.join(" + "));
    }
  }
  if (requirements.flags) {
    const missingFlags = requirements.flags.filter((flag) => !state.flags[flag]);
    if (missingFlags.length) {
      notes.push(missingFlags.join(" + "));
    }
  }

  return notes;
}
