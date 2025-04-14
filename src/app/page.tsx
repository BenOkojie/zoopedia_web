import { Suspense } from 'react';
import GameUI from './GameUI';
import { cookies } from 'next/headers';
export default async function Page() {
  const sessionId = (await cookies()).get('sessionId')?.value;

  return (
    <Suspense fallback={<div className="text-center p-6">Loading game...</div>}>
      <GameUI sessionId={sessionId || 'guest'}/>
    </Suspense>
  );
}
