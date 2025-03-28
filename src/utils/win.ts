// import { redis } from '@/lib/redis';

// export async function handleWin(userId: string, score: number) {
//   const today = new Date().toISOString().slice(0, 10);
//   const gameKey = `user:${userId}:game:${today}`;
//   const dailyLBKey = `leaderboard:daily:${today}`;
//   const globalLBKey = `leaderboard:global`;

//   // 1. Update win status in the user's game
//   await redis.hset(gameKey, {
//     isWin: true,
//     score,
//     wonAt: Date.now(),
//   });

//   // 2. Add score to daily leaderboard (ZSET)
//   await redis.zadd(dailyLBKey, { score, member: userId });

//   // 3. Add score to global leaderboard (ZSET)
//   await redis.zadd(globalLBKey, { score, member: userId });

//   console.log(`🏆 ${userId} won with score ${score}`);
// }

// utils/win.ts
import { redis } from '@/lib/redis';

export async function handleWin(userId: string, score: number, timeTaken:number): Promise<{ success: boolean }> {
  const today = new Date().toISOString().slice(0, 10);
  const userGameKey = `user:${userId}:game:${today}`;
  const dailyLBKey = `leaderboard:daily:${today}`;
  const globalLBKey = `leaderboard:global`;
  await redis.zadd(globalLBKey, { score, member: userId });
  await redis.zadd(dailyLBKey, { score, member: userId });

  await redis.hset(userGameKey, {
    isWin: true,
    score,
    wonAt: Date.now(),
    timeTaken,
  });

  return { success: true };
}
