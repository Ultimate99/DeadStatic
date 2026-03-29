export function countLogCategories(logEntries, orderedCategories) {
  return orderedCategories
    .map((category) => ({
      category,
      amount: logEntries.filter((entry) => (entry.category || "general") === category).length,
    }))
    .filter((entry) => entry.amount > 0);
}
