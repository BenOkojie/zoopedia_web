// src/utils/users.ts

import { redis } from '@/lib/redis';

export async function startUserGame(userId: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  const gameKey = `user:${userId}:game:${today}`;

  const exists = await redis.exists(gameKey);
  if (exists) return; // Game already started

  await redis.hset(gameKey, {
    guesses: JSON.stringify([]),
    score: 0,
    isWin: false,
    startedAt: Date.now(),
    loss: false,
  });
}
