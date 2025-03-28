// src/app/api/win/route.ts
import { handleWin } from '@/utils/win';
import { generateLeaderboard } from '@/utils/leaderboard';
export async function POST(req: Request) {
    const body = await req.json();
    console.log('🐞 Incoming win payload:', body);
    

//   if (!userId || typeof score !== 'number') {
//     return new Response(JSON.stringify({ error: 'Missing userId or score' }), { status: 400 });
//   }
const userId = body.userId;
const score = body.score;
const timeTaken = body.timeTaken;
console.log('🔥 Received win payload:', userId );
console.log('🔥 Received win payload:', score );
try {
    const result = await handleWin(userId, score, timeTaken);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ handleWin failed:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
