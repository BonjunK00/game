import Phaser from 'phaser';

const TILE_SIZE = 30;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;

const TETROMINOES: number[][][] = [
  // T
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  // O
  [
    [1, 1],
    [1, 1],
  ],
  // I
  [
    [1, 1, 1, 1],
  ],
  // L
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  // J
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  // Z
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];

export default class BorntrisScene extends Phaser.Scene {
  private field: number[][] = [];
  private currentBlock: { shape: number[][]; x: number; y: number } | null = null;
  private blockGraphics: Phaser.GameObjects.Rectangle[] = [];
  private fixedBlockGraphics: Phaser.GameObjects.Rectangle[] = [];

  private score: number = 0;
  private onScoreChange?: (score: number) => void;

  private isGameOver: boolean = false;
  private isDropping: boolean = false;
  private spacePressed: boolean = false;

  constructor() {
    super('BorntrisScene');
  }

  init(data: { onScoreChange?: (score: number) => void }) {
    this.onScoreChange = data.onScoreChange;
    this.score = 0;
    this.isGameOver = false;
    this.field = [];
    this.currentBlock = null;
    this.blockGraphics = [];
    this.fixedBlockGraphics = [];
  }

  create() {
    this.createEmptyField();
    this.spawnNewBlock();

    this.time.addEvent({
      delay: 500,
      loop: true,
      callback: this.dropBlock,
      callbackScope: this,
    });

    this.input.keyboard?.on('keydown-LEFT', (event: KeyboardEvent) => {
      event.preventDefault();
      this.tryMove(-1, 0);
    });

    this.input.keyboard?.on('keydown-RIGHT', (event: KeyboardEvent) => {
      event.preventDefault();
      this.tryMove(1, 0);
    });

    this.input.keyboard?.on('keydown-DOWN', (event: KeyboardEvent) => {
      event.preventDefault();
      this.tryMove(0, 1);
    });

    this.input.keyboard?.on('keydown-UP', (event: KeyboardEvent) => {
      event.preventDefault();
      this.tryRotate();
    });

    this.input.keyboard?.on('keydown-SPACE', (event: KeyboardEvent) => {
      if (this.spacePressed) return;

      event.preventDefault();
      this.spacePressed = true;
      this.hardDrop();
    });

    this.input.keyboard?.on('keyup-SPACE', () => {
      this.spacePressed = false;
    });
  }

  createEmptyField() {
    this.field = Array.from({length: GRID_HEIGHT}, () => Array(GRID_WIDTH).fill(0));
  }

  spawnNewBlock() {
    const shape = Phaser.Utils.Array.GetRandom(TETROMINOES); // 랜덤 선택
    const x = Math.floor((GRID_WIDTH - shape[0].length) / 2); // 중앙 정렬
    const y = 0

    if (this.isColliding(shape, x, y)) {
      this.endGame();
      return;
    }

    this.currentBlock = {shape, x, y};
    this.renderCurrentBlock();
  }

  renderCurrentBlock() {
    this.blockGraphics.forEach((r) => r.destroy());
    this.blockGraphics = [];

    if (!this.currentBlock) return;

    const {shape, x: offsetX, y: offsetY} = this.currentBlock;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const rect = this.drawTile(offsetX + x, offsetY + y, 0xff3b3b);
          this.blockGraphics.push(rect);
        }
      }
    }
  }

  drawTile(x: number, y: number, color: number): Phaser.GameObjects.Rectangle {
    const pixelX = x * TILE_SIZE + TILE_SIZE / 2;
    const pixelY = y * TILE_SIZE + TILE_SIZE / 2;

    const rect = this.add.rectangle(pixelX, pixelY, TILE_SIZE, TILE_SIZE, color);
    rect.setStrokeStyle(1, 0xffffff);
    return rect;
  }

  dropBlock() {
    if (this.isGameOver || !this.currentBlock) return;

    const nextY = this.currentBlock.y + 1;
    if (this.isColliding(this.currentBlock.shape, this.currentBlock.x, nextY)) {
      this.fixCurrentBlock();
      this.spawnNewBlock();
    } else {
      this.currentBlock.y = nextY;
      this.renderCurrentBlock();
    }
  }

  isColliding(shape: number[][], offsetX: number, offsetY: number): boolean {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 0) continue;

        const newX = offsetX + x;
        const newY = offsetY + y;

        // 바닥 충돌
        if (newY >= GRID_HEIGHT) return true;

        // 벽 충돌
        if (newX >= GRID_WIDTH || newX < 0) return true;

        // 다른 블록과 충돌
        if (this.field[newY]?.[newX] === 1) return true;
      }
    }
    return false;
  }

  fixCurrentBlock() {
    const {shape, x: offsetX, y: offsetY} = this.currentBlock!;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const fieldY = offsetY + y;
          const fieldX = offsetX + x;
          if (fieldY >= 0 && fieldY < GRID_HEIGHT && fieldX >= 0 && fieldX < GRID_WIDTH) {
            this.field[fieldY][fieldX] = 1;
          }
        }
      }
    }

    this.clearFullLines();
    this.renderFixedBlocks();
  }

  renderFixedBlocks() {
    this.fixedBlockGraphics.forEach((rect) => rect.destroy());
    this.fixedBlockGraphics = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (this.field[y][x] === 1) {
          const rect = this.drawTile(x, y, 0x4444ff); // 고정된 블록은 파란색
          this.fixedBlockGraphics.push(rect);
        }
      }
    }
  }

  tryMove(dx: number, dy: number) {
    if (!this.currentBlock || this.isDropping) return;

    const {shape, x, y} = this.currentBlock;
    const newX = x + dx;
    const newY = y + dy;

    if (!this.isColliding(shape, newX, newY)) {
      this.currentBlock.x = newX;
      this.currentBlock.y = newY;
      this.renderCurrentBlock();
    }
  }

  tryRotate() {
    if (!this.currentBlock || this.isDropping) return;

    const rotated = this.rotateMatrix(this.currentBlock.shape);
    const {x, y} = this.currentBlock;

    if (!this.isColliding(rotated, x, y)) {
      this.currentBlock.shape = rotated;
      this.renderCurrentBlock();
    }
  }

  // 2D 배열 오른쪽으로 90도 회전
  rotateMatrix(matrix: number[][]): number[][] {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = Array.from({length: cols}, () => Array(rows).fill(0));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        result[x][rows - 1 - y] = matrix[y][x];
      }
    }

    return result;
  }

  clearFullLines() {
    let linesCleared = 0;

    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (this.field[y].every((cell) => cell === 1)) {
        this.field.splice(y, 1); // 줄 삭제
        this.field.unshift(Array(GRID_WIDTH).fill(0)); // 맨 위에 빈 줄 추가
        linesCleared++;
        y++; // 다시 같은 y 확인 (위가 내려옴)
      }
    }

    if (linesCleared > 0) {
      this.score += linesCleared * 100;
      this.onScoreChange?.(this.score);
    }
  }

  endGame() {
    this.isGameOver = true;

    // 블록 제거
    this.currentBlock = null;
    this.blockGraphics.forEach((r) => r.destroy());
    this.blockGraphics = [];

    // 게임 오버 메시지 표시
    this.add.text(50, 250, 'GAME OVER', {
      fontSize: '32px',
      color: '#ff3b3b',
    });

    // 👇 React로 전달할 수 있음 (선택)
    this.onScoreChange?.(-1); // -1이면 게임오버 신호로 쓰자
  }

  hardDrop() {
    if (!this.currentBlock || this.isDropping) return;

    this.isDropping = true;

    const dropper = this.time.addEvent({
      delay: 15,
      loop: true,
      callback: () => {
        if (!this.currentBlock) {
          this.isDropping = false;
          dropper.remove();
          return;
        }

        const nextY = this.currentBlock.y + 1;
        if (this.isColliding(this.currentBlock.shape, this.currentBlock.x, nextY)) {
          this.fixCurrentBlock();
          this.spawnNewBlock();
          this.isDropping = false;
          dropper.remove();
        } else {
          this.currentBlock.y = nextY;
          this.renderCurrentBlock();
        }
      },
      callbackScope: this,
    });
  }
}