'use client';

import {useEffect, useRef} from 'react';
import Phaser from 'phaser';
import BorntrisScene from './scene';

export default function BorntrisGame(
    {
      onScoreChange,
      restartSignal,
      paused,
      onRestartHandled,
    }: {
      onScoreChange?: (score: number) => void;
      restartSignal?: boolean;
      paused: boolean;
      onRestartHandled?: () => void;
    }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 300,
      height: 600,
      parent: containerRef.current,
      backgroundColor: '#1a1a1a',
      scene: {
        preload() {
        },
        create() {
          this.scene.add('BorntrisScene', BorntrisScene, true, {
            onScoreChange,
          });
        },
      },
    });

    gameRef.current = game;

    return () => game.destroy(true);
  }, []);

  useEffect(() => {
    if (!gameRef.current) return;
    const scene = gameRef.current.scene.getScene('BorntrisScene');
    if (scene) {
      paused ? scene.scene.pause() : scene.scene.resume();
    }
  }, [paused]);

  useEffect(() => {
    if (restartSignal && gameRef.current) {
      const scene = gameRef.current.scene.getScene('BorntrisScene');
      scene.scene.restart({onScoreChange});
      onRestartHandled?.();
    }
  }, [restartSignal]);

  return <div ref={containerRef} className="w-[300px] h-[600px]"/>;
}