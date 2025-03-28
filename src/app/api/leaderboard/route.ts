// src/app/api/leaderboard/route.ts
import { generateLeaderboard } from '@/utils/leaderboard';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
    }
    console.log("route leaderboard before")
    console.log({userId})
    const leaderboard = await generateLeaderboard(userId);
    console.log("route leaderboard check", leaderboard)

    return new Response(JSON.stringify(leaderboard), { status: 200 });
  } catch (err) {
    console.error('❌ Error generating leaderboard:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
