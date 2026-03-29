window.DEAD_STATIC_CONFIG = {
  ...(window.DEAD_STATIC_CONFIG || {}),
  leaderboard: {
    enabled: false,
    functionsBaseUrl: "",
    publicToken: "",
    listPath: "leaderboard-list",
    submitPath: "leaderboard-submit",
    limit: 10,
  },
};
