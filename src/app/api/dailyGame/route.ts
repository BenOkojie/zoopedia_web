import { createDailyGame } from '@/utils/game';

export async function GET() {
  try {
    const { animal, hints } = await createDailyGame();

    return new Response(JSON.stringify({ animal, hints }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ Error creating daily game:', err);
    return new Response(JSON.stringify({ error: 'Failed to get daily game' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
