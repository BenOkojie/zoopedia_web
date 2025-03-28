// interface LeaderboardEntry {
//     userId: string;
//     score: number;
//     rank: number;
//   }
  
//   interface LeaderboardResult {
//     leaderboard: LeaderboardEntry[];
//     user: { rank: number; score: number } | null;
//   }
  

//   export function generateLeaderboard(
//     sortedList: (string | number)[],
//     userIdToFind?: string
//   ): LeaderboardResult {
//     const leaderboard: LeaderboardEntry[] = [];
//     let rank = 1;
//     let prevScore: number | null = null;
  
//     for (let i = 0; i < sortedList.length; i += 2) {
//       const id = sortedList[i] as string;
//       const score = typeof sortedList[i + 1] === 'string'
//         ? parseFloat(sortedList[i + 1] as string)
//         : (sortedList[i + 1] as number);
  
//       // Check for tie in score
//       if (prevScore !== null && score !== prevScore) {
//         rank = leaderboard.length + 1;
//       }
  
//       leaderboard.push({ userId: id, score, rank });
//       prevScore = score;
//     }
  
//     let user: { rank: number; score: number } | null = null;
//     if (userIdToFind) {
//       const entry = leaderboard.find((entry) => entry.userId === userIdToFind);
//       if (entry) {
//         user = { rank: entry.rank, score: entry.score };
//       }
//     }
  
//     return { leaderboard, user };
//   }
// src/utils/leaderboard.ts
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
