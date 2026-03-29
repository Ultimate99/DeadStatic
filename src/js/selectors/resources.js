export function getVisibleResourceIds(state, resourceOrder) {
  return [...state.discoveredResources]
    .filter((resourceId) => resourceOrder.includes(resourceId))
    .sort((left, right) => resourceOrder.indexOf(left) - resourceOrder.indexOf(right));
}
