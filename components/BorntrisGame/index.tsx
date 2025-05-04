'use client';

import {useEffect, useRef} from 'react';
import Phaser from 'phaser';
import BorntrisScene from './scene';

export default function BorntrisGame() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 300,
      height: 600,
      backgroundColor: '#1a1a1a',
      parent: containerRef.current,
      scene: [BorntrisScene],
      physics: {default: 'arcade'},
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef}/>;
}