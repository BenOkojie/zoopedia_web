// 'use client';

// interface WinPageProps {
//   correctAnswer: string;
//   guesses: string[];
//   score: number;
//   multiplier: number;
//   time: string;
//   dailyRank?: number | null;
//   globalRank?: number | null;
//   // onReset: () => void; // ❌ removed button use, but keep this if you still need it
// }

// export default function WinPage({
//   correctAnswer,
//   guesses,
//   score,
//   multiplier,
//   time,
//   dailyRank,
//   globalRank,
// }: WinPageProps) {
//   return (
//     <div className="text-center p-6 border rounded shadow bg-green-50">
//       <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 You got it!</h2>

//       <p className="mb-2">
//         Correct Answer: <strong>{correctAnswer}</strong>
//       </p>
//       <p className="mb-2">Total Guesses: {guesses.length}</p>
//       <p className="mb-2">Time: {time}</p>
//       <p className="mb-4 text-lg">
//         Your Score: <strong>{score}</strong> × Multiplier <strong>{multiplier}x</strong> ={' '}
//         <span className="text-blue-600 font-bold">{score * multiplier}</span>
//       </p>

//       {/* 👇 NEW: Ranks */}
//       {dailyRank !== null && (
//         <p className="text-blue-600 mb-1">📅 Daily Rank: <strong>#{dailyRank}</strong></p>
//       )}
//       {globalRank !== null && (
//         <p className="text-gray-600 mb-4">🌍 Global Rank: <strong>#{globalRank}</strong></p>
//       )}

//       <div className="text-left text-sm bg-white p-4 rounded shadow max-w-md mx-auto">
//         <h3 className="font-semibold mb-2 text-center">Your Guesses:</h3>
//         <ul className="space-y-1 p-1 text-center items-center">
//           {guesses.map((guess, i) => (
//             <li key={i}>{guess}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';

interface WinPageProps {
    userId: string;
  correctAnswer: string;
  guesses: string[];
  score: number;
  multiplier: number;
  time: string;
  dailyRank: number | null;
  globalRank: number | null;
}

export default function WinPage({
    userId,
  correctAnswer,
  guesses,
  score,
  multiplier,
  time,
  dailyRank,
  globalRank,
}: WinPageProps) {
  const [finalDailyRank, setFinalDailyRank] = useState<number | null>(dailyRank);
  const [finalGlobalRank, setFinalGlobalRank] = useState<number | null>(globalRank);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId }), // Replace with actual userId when dynamic
        });

        const data = await res.json();
        console.log("data")
        setFinalDailyRank(data.daily.rank);
        setFinalGlobalRank(data.global.rank);
      } catch (err) {
        console.error('❌ Failed to fetch leaderboard:', err);
      }
    };

    if (dailyRank === null || globalRank === null) {
      fetchLeaderboard();
    }
  }, [dailyRank, globalRank]);

  return (
    <div className="text-center p-6 border rounded shadow bg-green-50">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🎉 You got it!</h2>
      <p className="mb-2">Correct Answer: <strong>{correctAnswer}</strong></p>
      <p className="mb-2">Total Guesses: {guesses.length}</p>
      <p className="mb-2">Time: {time}</p>
      <p className="mb-4 text-lg">
        Your Score: <strong>{score}</strong> × Multiplier <strong>{multiplier}x</strong> ={' '}
        <span className="text-blue-600 font-bold">{score * multiplier}</span>
      </p>

      <div className="text-sm text-gray-700 my-4">
        <p>📈 Daily Rank: {finalDailyRank !== null ? `#${finalDailyRank}` : 'Loading...'}</p>
        <p>🌐 Global Rank: {finalGlobalRank !== null ? `#${finalGlobalRank}` : 'Loading...'}</p>
      </div>

      <div className="text-left text-sm bg-white p-4 rounded shadow max-w-md mx-auto mt-4">
        <h3 className="font-semibold mb-2 text-center">Your Guesses:</h3>
        <ul className="space-y-1 p-1 text-center items-center">
          {guesses.map((guess, i) => (
            <li key={i}>{guess}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
