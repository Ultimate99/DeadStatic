window.DEAD_STATIC_CONFIG = {
  ...(window.DEAD_STATIC_CONFIG || {}),
  leaderboard: {
    enabled: true,
    functionsBaseUrl: "https://ujyjwzqvqcybkwqixweb.supabase.co/functions/v1",
    publicToken: "sb_publishable_LQJj5sKJWFkyQjxn4eOoBg_mKKQCvbi",
    listPath: "leaderboard-list",
    submitPath: "leaderboard-submit",
    limit: 10,
  },
};
