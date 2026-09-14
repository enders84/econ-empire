const SUPABASE_URL = "https://mjjdkhfwgstyhaklrwbk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Y4yJpBjvKz3NC2rizzdhJw_o9Ai2M_P";

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  cumulative_profit: number;
  cash: number;
  market_share: number;
  challenges_completed: number;
  created_at: string;
}

export interface ScoreSubmission {
  player_name: string;
  score: number;
  cumulative_profit: number;
  cash: number;
  market_share: number;
  challenges_completed: number;
}

const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
  "Content-Type": "application/json",
};

export async function submitTournamentScore(
  submission: ScoreSubmission,
): Promise<void> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/micro_empire_scores`,
    {
      method: "POST",
      headers: {
        ...headers,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(submission),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to submit score.");
  }
}

export async function fetchLeaderboard(
  limit = 50,
): Promise<LeaderboardEntry[]> {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/micro_empire_scores?select=*&order=score.desc,created_at.asc&limit=${limit}`,
    {
      headers,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to load leaderboard.");
  }

  const rows = (await response.json()) as LeaderboardEntry[];

  const bestByPlayer = new Map<string, LeaderboardEntry>();

  for (const row of rows) {
    const key = row.player_name.trim().toLowerCase();
    const currentBest = bestByPlayer.get(key);

    if (!currentBest || row.score > currentBest.score) {
      bestByPlayer.set(key, row);
    }
  }

  return [...bestByPlayer.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);
}
