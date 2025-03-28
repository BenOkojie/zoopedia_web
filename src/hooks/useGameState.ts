// hooks/useGameState.ts
import { useEffect, useState } from 'react';

interface GameState {
  isWin: boolean;
  isLoss: boolean;
  answers: string[];
  animal: string;
  hints: string[];
  loading: boolean;
  setAnswers: (answers: string[]) => void;
  setIsWin: (value: boolean) => void;
  setHints: (hints: string[]) => void;
}

export function useGameState(userId: string): GameState {
  const [isWin, setIsWin] = useState(false);
  const [isLoss, setIsLoss] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [animal, setAnimal] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameRes = await fetch('/api/dailyGame');
        const gameData = await gameRes.json();
        setAnimal(gameData.animal);
        setHints(gameData.hints);

        await fetch('/api/startGame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        const userRes = await fetch('/api/getUserGame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setAnswers(userData.guesses || []);
          setIsWin(userData.isWin === true || userData.isWin === 'true');
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error initializing game:', err);
      }
    };

    fetchGameData();
  }, [userId]);

  useEffect(() => {
    if (
      !isWin &&
      Array.isArray(answers) &&
      Array.isArray(hints) &&
      answers.length >= hints.length
    ) {
      setIsLoss(true);
    }
  }, [isWin, answers, hints]);

  return {
    isWin,
    isLoss,
    answers,
    animal,
    hints,
    loading,
    setAnswers,
    setIsWin,
    setHints,
  };
}
