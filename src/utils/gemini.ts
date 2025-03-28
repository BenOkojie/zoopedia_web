import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateHintsFromGemini(animal: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate 20 guessing game hints about the animal "${animal}".
All hints should be equally challenging and not immediately obvious.
Avoid giving away the answer early. Make each hint clever and informative.
Return only the hints as a numbered list, one hint per line.`;

  const result = await model.generateContent(prompt);
  const text = await result.response.text();

  const hints = text
    .split('\n')
    .map(line => line.replace(/^\d+[\).\s-]*/, '').trim())
    .filter(line => line.length > 0);

  return hints;
}
