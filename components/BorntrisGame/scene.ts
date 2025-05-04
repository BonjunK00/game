import Phaser from 'phaser';

export default class BorntrisScene extends Phaser.Scene {
  constructor() {
    super('BorntrisScene');
  }

  preload() {
    // 예: this.load.image('block', '/assets/block.png');
  }

  create() {
    this.add.text(10, 10, 'Tetris Starting...', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // 초기 블록 위치, 점수, 상태 등 설정
  }

  update() {
    // 블록 이동, 충돌 감지, 줄 제거 등 게임 루프
  }
}