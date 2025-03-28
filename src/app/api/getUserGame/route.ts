// src/app/api/getUserGame/route.ts
import { redis } from '@/lib/redis';

export async function POST(req: Request) {
    const { userId } = await req.json();
    const today = new Date().toISOString().slice(0, 10);
    const userKey = `user:${userId}:game:${today}`;
  
    const userData = await redis.hgetall(userKey);
  
    return new Response(
      JSON.stringify({
        isWin: userData?.isWin,
        guesses: userData?.guesses,
        loss: userData?.loss,
        timeTaken: userData?.timeTaken, 

      }),
      { status: 200 }
    );
  }
  