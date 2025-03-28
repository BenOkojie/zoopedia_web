import { GoogleGenerativeAI } from '@google/generative-ai'; // ✅ Correct class name
import { getRandomAnimal } from '@/data/animals';

export const dynamic = 'force-dynamic';

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
import { redis } from '@/lib/redis';

export async function GET() {
  await redis.set('test:key', '🎉 Redis is connected!');
  const result = await redis.get('test:key');

  return new Response(`Redis says: ${result}`);
}

export async function POST() {
  const animal = getRandomAnimal();

  const prompt = `Generate a list of 20 guessing game hints about a ${animal}.
Start vague and get more specific.
Each hint should be one sentence.
Respond with a plain numbered list. Do not include intro or closing sentences.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // or 'gemini-1.5-pro'

    const result = await model.generateContent(prompt);
    const text = await result.response.text(); // ✅ must call `.text()`

    console.log('🧠 Raw Gemini output:\n', text);

    // Try to parse JSON (if Gemini behaves)
    let hints: string[] = [];
    try {
      const json = JSON.parse(text);
      if (Array.isArray(json)) {
        hints = json;
      } else {
        throw new Error('Not valid array');
      }
    } catch {
      // Fallback: split by line
      hints = text
        .split('\n')
        .map(line => line.replace(/^\d+[\).\s-]*/, '').trim())
        .filter(line => line.length > 0);
    }

    return new Response(
      JSON.stringify({ success: true, animal, hints }),
      { status: 200 }
    );
  } catch (err) {
    console.error('❌ Gemini error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate hints' }), { status: 500 });
  }
}
