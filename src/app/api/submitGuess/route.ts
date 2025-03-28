import { redis } from '@/lib/redis';

export async function POST(req: Request) {
  const { userId, guess,hintCount } = await req.json();
  console.log('userId:', userId);
  console.log('guess:', guess);
  const today = new Date().toISOString().slice(0, 10);
  const key = `user:${userId}:game:${today}`;

  if (!userId || !guess) {
    return new Response(JSON.stringify({ error: 'Missing userId or guess' }), { status: 400 });
  }
  const gameData = (await redis.hgetall(key)) ?? {};

  
 
const userguess:string[] = <string[]>gameData.guesses;
const isWin = gameData.isWin === 'true';
  // Get current guesses
  const rawGuesses = await redis.hget<string[]>(key, 'guesses');
  console.log('rawGuesses:', rawGuesses);
  let guesses: string[] = [];
  console.log(hintCount-userguess.length);
  if (rawGuesses) {
    if(rawGuesses.length > 0){
        try {
            guesses = rawGuesses;
            } catch (err) {
            console.error('❌ Failed to parse guesses:', rawGuesses);
            console.error('❌ Error:', err);
            // Self-heal if it's not an array
            }
    }
    
  }
  if (!isWin && userguess.length >= hintCount) {
    await redis.hset(key, { loss: true });
    return new Response(JSON.stringify({
      success: true,
      guesses, 
      loss: true
    }));
  }
  // Avoid duplicate entries
  if (guesses.includes(guess)) {
    return new Response(JSON.stringify({ message: 'Already guessed' }));
  }

  // Save updated guesses
  guesses.push(guess);
  await redis.hset(key, {
    guesses: JSON.stringify(guesses), // guesses should be string[]
  });
  
  return new Response(JSON.stringify({
    success: true,
    guesses, 
    
  }));
}
