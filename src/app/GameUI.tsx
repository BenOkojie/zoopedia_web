'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid';

import stringSimilarity from 'string-similarity';
import HintList from './hintList';
import WinPage from './winPage';
import LossPage from './lossPage';
interface HintResponse {
  animal: string;
  hints: string[];
}
export default function  GameUI({ sessionId }: { sessionId: string }) {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [animal, setAnimal] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [isWin, setIsWin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const visibleHints = hints.slice(0, answers.length);
  const score = hints.length - answers.length + 1;
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const rawMultiplier = 10 - Math.floor(elapsedTime / 120);
  const multiplier = rawMultiplier < 1 ? 1 : rawMultiplier;

  const tempUserId = sessionId;
  const SIMILARITY_THRESHOLD = 0.85;
  const correctAnswer = animal;
  const baseScore = hints.length - answers.length + 1;
  const finalScore = Math.max(1, baseScore * multiplier);
  const [isLoss, setIsLoss] = useState(false);
  const [userDailyRank, setUserDailyRank] = useState<number | null>(null);
const [userGlobalRank, setUserGlobalRank] = useState<number | null>(null);
const [stateInitialized, setStateInitialized] = useState(false);


  useEffect(() => {
    const fetchGameData = async () => {
      console.log(tempUserId)
      try {
        const res = await fetch('/api/dailyGame');
        const data: HintResponse = await res.json();
        setAnimal(data.animal);
        setHints(data.hints);

        // Start user's game session
        await fetch('/api/startGame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: tempUserId }),
        });
        const userRes = await fetch('/api/getUserGame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId:tempUserId }),
        });
        
        if (userRes.ok) {
          const userData = await userRes.json();
          setIsWin(userData.isWin);
          setAnswers(userData.guesses || []);
          setIsLoss(userData.loss);
          setElapsedTime(userData.timeTaken || 0);
          setStateInitialized(true); // ✅ Now we're safe to render
        
      }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error initializing game:', err);
      }
    };

    fetchGameData();
  }, []);

  useEffect(() => {
    if (startTime && !isWin) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isWin]);

  const handleSubmit = async () => {
    if (input.trim() === '') return;
  
    const guess = input.trim().toLowerCase();
  
    const similarGuess = answers.find(
      (prev) => stringSimilarity.compareTwoStrings(prev.toLowerCase(), guess) >= SIMILARITY_THRESHOLD
    );
  
    if (similarGuess) {
      setFeedback(`You've already guessed something like "${similarGuess}". Try something else!`);
      return;
    }
  
    try {
      const res = await fetch('/api/submitGuess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: tempUserId,
          guess,
          hintCount: hints.length, }),
      });
  
      const data = await res.json();
  
      if (data.message === 'Already guessed') {
        setFeedback(`You already guessed "${guess}".`);
        return;
      }
      console.log(data)
      setAnswers(data.guesses);
      setIsLoss(data.loss) // Update with backend-confirmed guesses
      setInput('');
      setFeedback('');
  
      // Start timer if first guess
      if (data.guesses.length === 1 && !startTime) {
        setStartTime(Date.now());
      }
  
      // Check for win
      if (guess === animal.toLowerCase()) {
        setIsWin(true);
        if (timerRef.current) clearInterval(timerRef.current);
      
      
        await fetch('/api/win', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId:tempUserId, score: finalScore, timeTaken: elapsedTime }),
        });
        const leaderboardRes = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: tempUserId }),
        });
      
        const leaderboardData = await leaderboardRes.json();
        setUserDailyRank(leaderboardData.daily);
        setUserGlobalRank(leaderboardData.global);
        // const data = await res.json();
        // setUserDailyRank(data.daily.rank);
        // setUserGlobalRank(data.global.rank);
      }
    } catch (err) {
      console.error('❌ Failed to submit guess:', err);
      setFeedback('Error submitting guess. Try again.');
    }
  };


  if (loading|| !stateInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl animate-pulse text-gray-500">Loading today’s challenge...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="mx-auto"
          src="/logo.png"
          alt="Game logo"
          width={360}
          height={400}
          priority
        />

        {!isWin && startTime &&!isLoss&&(
          <div className="text-center mb-4 text-sm text-gray-600">
            Time: {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')} •
            Multiplier: <span className="font-bold text-blue-600">{multiplier}x</span>
          </div>
        )}

{isLoss ? (
   <LossPage
   correctAnswer={correctAnswer}
 />
 

) : isWin ? (
  <WinPage
  userId={tempUserId}
  correctAnswer={correctAnswer}
  guesses={answers}
  score={score}
  multiplier={multiplier}
  time={`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
  dailyRank={userDailyRank}
  globalRank={userGlobalRank}
/>

) : (
  <>
    {/* Game UI */}
    <div className="text-center text-sm text-gray-600">
      Lives: {'❓'.repeat(hints.length - answers.length+1)}
    </div>
    
    <div className="flex flex-1 gap-4">
      {/* Left: Guess input */}
      <div className="w-1/2 border rounded-lg p-4 h-64 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2">Your Guess</h2>
        <div className="flex justify-between">
          <textarea
            className="w-full p-1 h-10 border rounded resize-none"
            placeholder="Guess an animal"
            value={input}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 p-2 h-10 hover:bg-blue-600"
          >
            <ArrowRightCircleIcon className="h-6 w-6 text-white" />
          </button>
        </div>
        {feedback && (
          <p className="text-red-500 text-sm text-center mb-2">{feedback}</p>
        )}
        <ul className="space-y-1 p-1 text-center items-center">
          {answers.map((answer, index) => (
            <li key={index} className="bg-gray-100 rounded">{answer}</li>
          ))}
        </ul>
      </div>

      {/* Right: Hints */}
      <HintList hints={visibleHints} />
    </div>
  </>
)}

      </main>
    </div>
  );
}
