import { defineStore } from 'pinia';
import GhostWorker from '../workers/ghostWorker.js?worker';

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
      ['|', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '|'],
      ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
      ['|', '.', '.', '.', '.', '^', '.', '.', '-', '.', '.', '-', '.', '.', '^', '.', '.', '.', '.', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '-', '.', '.', '-', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '[', ']', '.', '.', '.', 'X', '.', '.', '[', ']', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '|'],
      ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
      ['|', '.', '-', '-', '.', '[', '-', '-', '-', '-', '-', '-', '-', '-', ']', '.', '-', '-', '.', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
    ],
    ghostPosition: { x: 0, y: 0 },
    ghostPath: [],
    ghostSpeed: 3,
  }),
  actions: {
    levelCleared() {
      this.map = this.getInitialMap();
      this.setInitialPacManPositionAndSize();
      this.setInitialGhostPosition();
    },
    resetGame() {
      this.score = 0;
      this.lives = 3;
      this.map = this.getInitialMap();
      this.setInitialPacManPositionAndSize();
      this.setInitialGhostPosition();
    },
    getInitialMap() {
      return [
        ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['|', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '|'],
        ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '-', '.', '.', '-', '.', '.', '^', '.', '.', '.', '.', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '-', '.', '.', '-', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '[', ']', '.', '.', '.', 'X', '.', '.', '[', ']', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '|'],
        ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
        ['|', '.', '-', '-', '.', '[', '-', '-', '-', '-', '-', '-', '-', '-', ']', '.', '-', '-', '.', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
      ];
    },
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
    setInitialGhostPosition() {
      for (let row = 0; row < this.map.length; row++) {
        for (let col = 0; col < this.map[row].length; col++) {
          if (this.map[row][col] === 'X') {
            this.ghostPosition.x = col * this.cellWidth + this.pacManRadius / 2;
            this.ghostPosition.y = row * this.cellHeight + this.pacManRadius / 2;
            return;
          }
        }
      }
    },
    movePacMan() {
      const nextX = Math.round(this.pacManPosition.x + this.pacManDirection.x * this.pacManSpeed);
      const nextY = Math.round(this.pacManPosition.y + this.pacManDirection.y * this.pacManSpeed);

      // Check map and boundary collisions
      if (this.isCellWalkable(nextX, nextY, this.pacManDirection) && this.isInGameBoundaries(nextX, nextY)) {
        this.pacManPosition.x = nextX;
        this.pacManPosition.y = nextY;

        const cellX = Math.floor(this.pacManPosition.x / this.cellWidth);
        const cellY = Math.floor(this.pacManPosition.y / this.cellHeight);

        // Check if Pac-Man is in a cell with a dot
        if (this.map[cellY][cellX] === '.') {
          this.map[cellY][cellX] = ' '; // Replace the dot with an empty space
          this.score += 1;             // Update the score
        }
      }
    },
    isCellWalkable(nextX, nextY, direction) {
      const checkPoint = (x, y) => {
        const cellX = Math.floor(x / this.cellWidth);
        const cellY = Math.floor(y / this.cellHeight);
        const cellValue = this.map[cellY]?.[cellX];
        //console.log(`Checking cell at (${cellX}, ${cellY}): ${cellValue}`);
        return cellValue === '.' || cellValue === 'X' || cellValue === '^' || cellValue === ' '; // Walkable cells
      };

      let pointsToCheck = [];

      // Determine which points to check based on the direction
      if (direction.x === 0 && direction.y === -1) { // Moving up
        pointsToCheck = [
          { x: 0, y: 0}, // Top-left
          { x: this.pacManRadius / 2, y: 0 }, // Top-center
          { x: this.pacManRadius, y: 0 } // Top-right
        ];
      } else if (direction.x === 0 && direction.y === 1) { // Moving down
        pointsToCheck = [
          { x: 0, y: this.pacManRadius }, // Bottom-left
          { x: this.pacManRadius / 2, y: this.pacManRadius }, // Bottom-center
          { x: this.pacManRadius, y: this.pacManRadius }  // Bottom-right
        ];
      } else if (direction.x === -1 && direction.y === 0) { // Moving left
        pointsToCheck = [
          { x: 0, y: 0}, // Top-left
          { x: 0, y: this.pacManRadius / 2 }, // Left-center
          { x: 0, y: this.pacManRadius }  // Bottom-left
        ];
      } else if (direction.x === 1 && direction.y === 0) { // Moving right
        pointsToCheck = [
          { x: this.pacManRadius, y: 0 }, // Top-right
          { x: this.pacManRadius, y: this.pacManRadius / 2 }, // Right-center
          { x: this.pacManRadius, y: this.pacManRadius }  // Bottom-right
        ];
      }
      
      // Perform the check for the selected points
      const results = pointsToCheck.map(dir => checkPoint(nextX + dir.x, nextY + dir.y));
      //console.log("Walkable checks:", results);
      return results.every(result => result);
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
    checkCollisionAndReset() {
      const pacManCellX = Math.floor(this.pacManPosition.x / this.cellWidth);
      const pacManCellY = Math.floor(this.pacManPosition.y / this.cellHeight);
      const ghostCellX = Math.floor(this.ghostPosition.x / this.cellWidth);
      const ghostCellY = Math.floor(this.ghostPosition.y / this.cellHeight);
  
      if (pacManCellX === ghostCellX && pacManCellY === ghostCellY) {
        this.lives -= 1;
        this.setInitialPacManPositionAndSize();
        this.setInitialGhostPosition();
      }
    },
    changeDirection(newDirection) {
      this.pacManDirection = newDirection;
    },
    moveGhost() {
      // Check if there's a path
      if (this.ghostPath.length > 0) {
        const nextPos = this.ghostPath[0];
        const dx = nextPos.x * this.cellWidth - this.ghostPosition.x;
        const dy = nextPos.y * this.cellHeight - this.ghostPosition.y;

        // Move the ghost towards the next path position
        if (Math.abs(dx) > this.ghostSpeed || Math.abs(dy) > this.ghostSpeed) {
          this.ghostPosition.x += Math.sign(dx) * this.ghostSpeed;
          this.ghostPosition.y += Math.sign(dy) * this.ghostSpeed;
        } else {
          // If close enough to the target, set new target from the path
          this.ghostPosition.x = nextPos.x * this.cellWidth;
          this.ghostPosition.y = nextPos.y * this.cellHeight;
          this.ghostPath.shift(); // Remove the reached path point
        }
      }
      this.checkCollisionAndReset();
    },
    updateGhostPath() {
      // Send a request to the worker to calculate the path
      const worker = new GhostWorker();
      
      const serializedMap = this.map.map(row => [...row]);
      const ghostPosition = {
        x: Math.floor((this.ghostPosition.x + (this.pacManRadius / 2)) / this.cellWidth),
        y: Math.floor((this.ghostPosition.y + (this.pacManRadius / 2)) / this.cellHeight),
      };
      const targetPosition = {
        x: Math.floor(this.pacManPosition.x / this.cellWidth),
        y: Math.floor(this.pacManPosition.y / this.cellHeight),
      };
      const rows = this.map.length;
      const cols = this.map[0].length;

      worker.postMessage({
        map: serializedMap,
        ghostPosition,
        targetPosition,
        rows,
        cols
      });

      worker.onmessage = (event) => {
        this.ghostPath = event.data.path;  // Update the ghost path with the new one
        worker.terminate();
      };
    }
  },
  getters: {
    hasWon(state) {
      return !state.map.flat().includes('.');
    },
    gameOver(state) {
      return state.lives <= 0;
    }
  }
});
