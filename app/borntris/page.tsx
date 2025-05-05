// app/borntris/page.tsx
'use client';

import dynamic from 'next/dynamic';
import {useEffect, useState} from "react";

const BorntrisGame = dynamic(() => import('@/components/BorntrisGame'), {ssr: false});

export default function Borntris() {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [restartSignal, setRestartSignal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        e.preventDefault();
        setPaused(true);
      } else if (e.code === 'Enter') {
        e.preventDefault();
        setPaused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
      <main className="flex items-start justify-center bg-black pt-8 relative">
        <div className="flex flex-col items-center w-[300px] z-10">
          <h1 className="text-white text-4xl mb-2">Borntris</h1>
          <div className="text-white text-lg mb-2">Score: {score}</div>

          <BorntrisGame
              onScoreChange={(score) => {
                if (score === -1) {
                  setGameOver(true);
                } else {
                  setScore(score);
                }
              }}
              restartSignal={restartSignal}
              paused={paused}
              onRestartHandled={() => {
                setRestartSignal(false); // signal reset
                setScore(0);
                setGameOver(false);
              }}
          />
        </div>

        <div className="absolute right-20 top-50 flex flex-col gap-3 z-20">
          <button
              onClick={() => setRestartSignal(true)}
              className="px-4 py-2 bg-white text-[#111827] text-sm font-semibold
                 rounded-xl border border-gray-200 shadow-sm w-[100px]
                 hover:border-[#FF6B00] hover:shadow-md transition"
          >
            Restart
          </button>

          <button
              onClick={() => setPaused((prev) => !prev)}
              className="px-4 py-2 bg-white text-[#111827] text-sm font-semibold
                 rounded-xl border border-gray-200 shadow-sm w-[100px]
                 hover:border-[#FF6B00] hover:shadow-md transition"
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </main>
  );
}