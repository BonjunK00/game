// app/borntris/page.tsx
'use client';

import dynamic from 'next/dynamic';

const BorntrisGame = dynamic(() => import('@/components/BorntrisGame'), {ssr: false});

export default function Borntris() {
  return (
      <main className="flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="text-4xl text-white mb-4">Borntris</h1>
        <BorntrisGame/>
      </main>
  );
}