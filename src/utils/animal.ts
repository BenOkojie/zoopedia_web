import { redis } from '@/lib/redis';
import { animals300 } from '@/data/animals'; // wherever your master list of animals is
import  {generateHintsFromGemini } from './gemini'; // we'll build this next
const ANIMALS_POOL_KEY = 'animals:pool';
const ANIMALS_USED_KEY = 'animals:used';

/**
 * Initialize the animal pool if it's empty
 */
export async function initAnimalPool() {
  const count = await redis.scard(ANIMALS_POOL_KEY);
  if (count === 0) {
    // await redis.sadd(ANIMALS_POOL_KEY, ...(animals300 as string[]));
    for (const animal of animals300) {
        await redis.sadd('animals:pool', animal);
      }
    console.log(`🐾 Initialized animal pool with ${animals300.length} animals.`);
  }
}

/**
 * Pick and remove a random animal from the pool, and move to used
 */
export async function pickRandomAnimal(): Promise<string> {
  const animal = await redis.srandmember<string>(ANIMALS_POOL_KEY);
  if (!animal) throw new Error('❌ No animals left in the pool.');

  await redis.srem(ANIMALS_POOL_KEY, animal);
  await redis.sadd(ANIMALS_USED_KEY, animal);

  return animal;
}

/**
 * Move all used animals back into the pool
 */
export async function refillAnimalPool() {
  const used = await redis.smembers(ANIMALS_USED_KEY);
  if (used.length > 0) {
    for (const _ of used) {
        await redis.sadd(ANIMALS_POOL_KEY, used);
    }
    await redis.del(ANIMALS_USED_KEY);
    console.log(`🔁 Refilled pool with ${used.length} animals`);
  }
}

/**
 * Get current counts of pool/used
 */
export async function getAnimalStats() {
  const poolCount = await redis.scard(ANIMALS_POOL_KEY);
  const usedCount = await redis.scard(ANIMALS_USED_KEY);
  return { poolCount, usedCount };
}


export async function getHintsForAnimal(animal: string): Promise<string[]> {
  const key = `hints:${animal}`;
  const cached = await redis.get<string>(key);

  let fullHints: string[];

  if (cached) {
    fullHints = JSON.parse(cached);
  } else {
    fullHints = await generateHintsFromGemini(animal);
    await redis.set(key, JSON.stringify(fullHints));
  }

  // Shuffle and take 8 random hints
  const shuffled = [...fullHints].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8);
}
