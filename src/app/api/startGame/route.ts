// src/app/api/startGame/route.ts

import { startUserGame } from '@/utils/users';

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
  }

  try {
    await startUserGame(userId);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Failed to start user game:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
