
import { redis } from '@/lib/redis';

const getTodayKey = () => new Date().toISOString().slice(0, 10);

export async function generateLeaderboard(userId: string) {
  const today = getTodayKey();
  const DAILY_LEADERBOARD_KEY = `leaderboard:daily:${today}`;
  const GLOBAL_LEADERBOARD_KEY = 'leaderboard:global';

  const getSortedLeaderboard = async (key: string) => {
  const r = await redis.zrange(key, 0, -1, { withScores: true });
  console.log('r:', r.length);
  const raw = r.reverse();
  const leaderboard: { userId: string; score: number; rank: number }[] = [];

  let rank = 1;
  let prevScore: number | null = null;

  for (let i = 0; i < raw.length; i += 2) {
    const userId = raw[i+1] as string;
    const score = Number(raw[i ]);

    if (prevScore !== null && score !== prevScore) {
      // Only increment rank if the score changed
      rank = rank + 1;
    }

    leaderboard.push({ userId, score, rank });
    prevScore = score;
  }

  return leaderboard;
};

  const daily = await getSortedLeaderboard(DAILY_LEADERBOARD_KEY);
  const global = await getSortedLeaderboard(GLOBAL_LEADERBOARD_KEY);

  const findUserRank = (
    list: { userId: string; score: number; rank: number }[],
  ): { rank: number | null; score: number | null } => {
    const today = getTodayKey();
    const userKey = userId;
    console.log('userKey:', userKey);
    const entry = list.find((e) => e.userId === userKey);
    console.log('entry:', entry);
    return entry ? { rank: entry.rank, score: entry.score } : { rank: null, score: null };
  };

  return {
    daily: findUserRank(daily),
    global: findUserRank(global),
    fullDaily: daily,
    fullGlobal: global,
  };
}
