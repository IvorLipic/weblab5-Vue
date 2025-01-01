import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    score: 0,
    lives: 3,
    pacManPosition: { x: 0, y: 0 },
    pacManDirection: { x: 0, y: 0 },
    pacManRadius: 0,
    pacManSpeed: 5,
    gameWidth: 800,
    gameHeight: 600,
    cellWidth: 40,
    cellHeight: 40,
    map: [
      ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '.', '.', '[', '-', ']', '.', '.', '.', '[', '-', '-', '-', '-', '-', '-', ']', '.', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '_', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '.', '.', '[', ']', '.', '^', '.', '[', ']', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '.', '.', '[', '-', ']', '.', '.', '-', 'X', '-', '.', '.', '-', '-', '[', '+', ']', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '.', '.', '[', ']', '.', '^', '.', '[', ']', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '.', '.', '[', '-', ']', '.', '.', '.', '[', '-', '] ', '.', '.', '.', '[', '-', ']', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '.', '.', '.', '[', ']', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
    ]
  }),
  actions: {
    setGameDimensions(width, height) {
      this.gameWidth = width;
      this.gameHeight = height;
    },
    setCellDimensions(cellWidth, cellHeight) {
      this.cellWidth = cellWidth;
      this.cellHeight = cellHeight;
    },
    setInitialPacManPositionAndSize() {
      for (let row = 0; row < this.map.length; row++) {
        for (let col = 0; col < this.map[row].length; col++) {
          if (this.map[row][col] === '.') {
            if (this.cellWidth < this.cellHeight) {
              this.pacManRadius = this.cellWidth / 1.5;
            } else {
              this.pacManRadius = this.cellHeight / 1.5;
            }
            this.pacManPosition.x = col * this.cellWidth + this.pacManRadius / 2;
            this.pacManPosition.y = row * this.cellHeight + this.pacManRadius / 2;
            return;
          }
        }
      }
    },
    movePacMan() {
      const nextX = this.pacManPosition.x + this.pacManDirection.x * this.pacManSpeed;
      const nextY = this.pacManPosition.y + this.pacManDirection.y * this.pacManSpeed;

      // Check map and boundary collisions
      if (this.isCellWalkable(nextX, nextY, this.pacManPosition.x, this.pacManPosition.y) && this.isInGameBoundaries(nextX, nextY)) {
        this.pacManPosition.x = nextX;
        this.pacManPosition.y = nextY;
      }
    },
    isCellWalkable(nextX, nextY, currX, currY) {
      const cellX = Math.floor(nextX / this.cellWidth);
      const cellY = Math.floor(nextY / this.cellHeight);
      let cellBottomBoundary = (cellY + 1)  * this.cellHeight;
      let cellRightBoundary = (cellX + 1) * this.cellWidth;

      
      const cellX_direction_down_right = Math.floor((nextX + this.pacManRadius * 2) / this.cellWidth);
      const cellY_direction_down_right = Math.floor((nextY + this.pacManRadius * 2) / this.cellHeight);
      let cellTopBoundary = cellY_direction_down_right * this.cellHeight;
      let cellLeftBoundary = cellX_direction_down_right * this.cellWidth;

      const cell_direction_right = this.map[cellY][cellX_direction_down_right];
      const cell_direction_down = this.map[cellY_direction_down_right][cellX];
      //const cell_direction_down_right = this.map[cellY_direction_down_right][cellX_direction_down_right];
      const cell_direction_up_left = this.map[cellY][cellX];

      if (currY < nextY) { // PacMan going down
        if (cell_direction_down !== '.' && cell_direction_down !== 'b' && cell_direction_down !== '^') { 
          if (nextY + this.pacManRadius >= cellTopBoundary) return false
        } 
      } else if (currY > nextY) { // PacMan going up
        if (cell_direction_up_left !== '.' && cell_direction_up_left !== 'b' && cell_direction_up_left !== '^') {
          if (nextY + this.pacManRadius >= cellBottomBoundary) return false
        }
      } else if (currX < nextX) { // PacMan going right
        if (cell_direction_right !== '.' && cell_direction_right !== 'b' && cell_direction_right !== '^') {
          if (nextX + this.pacManRadius >= cellRightBoundary) return false
        }
      } else if (currX > nextX) { // PacMan going left
        if (cell_direction_up_left !== '.' && cell_direction_up_left !== 'b' && cell_direction_up_left !== '^') {
          if (nextX + this.pacManRadius >= cellLeftBoundary) return false
        }
      }
      return true;
    },
    isInGameBoundaries(x, y) {
      const pacManSize = this.pacManRadius;
      return (
        x >= this.cellWidth &&
        x <= this.gameWidth - (this.cellWidth + pacManSize) &&
        y >= this.cellHeight  &&
        y <= this.gameHeight - (this.cellHeight + pacManSize)
      );
    },
    changeDirection(newDirection) {
      this.pacManDirection = newDirection;
    }
  }
});
