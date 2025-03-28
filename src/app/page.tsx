import { Suspense } from 'react';
import GameUI from './GameUI';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading game...</div>}>
      <GameUI />
    </Suspense>
  );
}
