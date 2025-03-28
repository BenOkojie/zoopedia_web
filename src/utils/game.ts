import { redis } from '@/lib/redis';
import { pickRandomAnimal,getHintsForAnimal, initAnimalPool } from './animal';


export async function createDailyGame(): Promise<{ animal: string; hints: string[] }> {
  const today = new Date().toISOString().slice(0, 10);
  const gameKey = `game:${today}`;

  // Check if game already exists
  const existing = await redis.hgetall<{ animal?: string; hints?: string[] }>(gameKey);
  console.log('existing:', existing);
  if (existing && existing.animal && existing.hints) {
    try {
        return {
          animal: existing.animal,
          hints: existing.hints, // ✅ expects a JSON stringified array
        };
      } catch (err) {
        console.error('❌ Failed to parse cached hints. Overwriting with fresh ones.', err);
        await redis.del(gameKey); // Clean out the bad cache
      }
  }
  await initAnimalPool(); // 👈 Make sure the pool exists
  // Generate new game
  const animal = await pickRandomAnimal();
  const hints = await getHintsForAnimal(animal);

  await redis.hset(gameKey, {
    animal,
    hints: JSON.stringify(hints),
    createdAt: Date.now(),
  });

  return { animal, hints };
}
