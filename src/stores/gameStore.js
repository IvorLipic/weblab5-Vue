// 10. Store (pinia)

import { defineStore } from 'pinia';
import GhostWorker from '../workers/ghostWorker.js?worker';
import { getDatabase, ref, push } from "firebase/database";

export const useGameStore = defineStore('game', {
  state: () => ({
    scoreSaved: false,
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
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'M', '|'],
      ['|', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '|'],
      ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
      ['|', '.', '.', '.', '.', '^', '.', '.', '-', '.', '.', '-', '.', '.', '^', '.', '.', '.', '.', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '-', '.', '.', '-', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '[', ']', '.', '.', '.', '.', '.', '.', '[', ']', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
      ['|', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '|'],
      ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
      ['|', '.', '-', '-', '.', '[', '-', '-', '-', '-', '-', '-', '-', '-', ']', '.', '-', '-', '.', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X', '|'],
      ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'],
    ],
    ghosts: [
      { id: 1, position: { x: 0, y: 0 }, path: [], speed: 3, color: 'blue' },
      { id: 2, position: { x: 100, y: 100 }, path: [], speed: 3, color: 'red' },
    ],
  }),
  actions: {
    async saveGameResults() {
      try {
        const db = getDatabase();
        const resultsRef = ref(db);
        await push(resultsRef, {
          score: this.score,
          pacManSpeed: this.pacManSpeed,
          ghostSpeed: this.ghosts[0].speed,
          timestamp: Date.now()
        });
        this.scoreSaved = true;
        console.log("Game results saved successfully!");
      } catch (error) {
        console.error("Error saving game results:", error);
      }
    },
    levelCleared() {
      this.map = this.getInitialMap();
      this.setInitialPacManPositionAndSize();
      this.setInitialGhostPositions();
    },
    resetGame() {
      this.scoreSaved = false;
      this.score = 0;
      this.lives = 3;
      this.map = this.getInitialMap();
      this.setInitialPacManPositionAndSize();
      this.setInitialGhostPositions();
    },
    getInitialMap() { 
      return [
        ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'M', '|'],
        ['|', '.', '-', '-', '-', '-', '-', '-', '-', '.', '.', '-', '-', '-', '-', '-', '-', '-', '.', '|'],
        ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '-', '.', '.', '-', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '[', ']', '.', '.', '.', '.', '.', '.', '[', ']', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', '|'],
        ['|', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '.', '.', '[', ']', '.', '.', '.', '.', '|'],
        ['|', '.', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '-', '.', '|'],
        ['|', '.', '-', '-', '.', '[', '-', '-', '-', '-', '-', '-', '-', '-', ']', '.', '-', '-', '.', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X', '|'],
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
      if (this.cellWidth < this.cellHeight) {
        this.pacManRadius = this.cellWidth / 1.5;
      } else {
        this.pacManRadius = this.cellHeight / 1.5;
      }
      this.pacManPosition.x = this.cellWidth + this.pacManRadius / 2;
      this.pacManPosition.y = this.cellHeight + this.pacManRadius / 2;
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
        return cellValue === '.' || cellValue === 'X' || cellValue === ' ' || cellValue === 'M'; // Walkable cells
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
    checkCollisionAndReset(ghost) {
      const pacManCellX = Math.floor(this.pacManPosition.x / this.cellWidth);
      const pacManCellY = Math.floor(this.pacManPosition.y / this.cellHeight);
      const ghostCellX = Math.floor(ghost.position.x / this.cellWidth);
      const ghostCellY = Math.floor(ghost.position.y / this.cellHeight);
  
      if (pacManCellX === ghostCellX && pacManCellY === ghostCellY) {
        this.lives -= 1;
        this.setInitialPacManPositionAndSize();
        this.setInitialGhostPositions();
      }
    },
    changeDirection(newDirection) {
      this.pacManDirection = newDirection;
    },
    setInitialGhostPositions() {
      let ghostsStartPosition = [
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]; 

      for (let row = 0; row < this.map.length; row++) {
        for (let col = 0; col < this.map[row].length; col++) {
          if (this.map[row][col] === 'X') {
            ghostsStartPosition[0].x = col * this.cellWidth + this.pacManRadius / 2;
            ghostsStartPosition[0].y = row * this.cellHeight + this.pacManRadius / 2; 
          } else if (this.map[row][col] === 'M') {
            ghostsStartPosition[1].x = col * this.cellWidth + this.pacManRadius / 2;
            ghostsStartPosition[1].y = row * this.cellHeight + this.pacManRadius / 2;
          }
        }
      }
      this.ghosts.forEach((ghost, index) => {
        ghost.position = ghostsStartPosition[index];
      });
    },
    async calculateGhostPaths() {
      const worker = new GhostWorker();

      const serializedMap = this.map.map(row => [...row]);
      const targetPosition = {
        x: Math.floor(this.pacManPosition.x / this.cellWidth),
        y: Math.floor(this.pacManPosition.y / this.cellHeight),
      };
      const rows = this.map.length;
      const cols = this.map[0].length;

      this.ghosts.forEach((ghost, index) => {

        const ghostPosition = {
          x: Math.floor((ghost.position.x + (this.pacManRadius / 2)) / this.cellWidth),
          y: Math.floor((ghost.position.y + (this.pacManRadius / 2)) / this.cellHeight),
        };

        worker.postMessage({
          map: serializedMap,
          ghostPosition,
          targetPosition,
          rows,
          cols,
          ghostIndex: index
        });

        let pathsProcessed = 0;
        const totalGhosts = this.ghosts.length;

        worker.onmessage = (e) => {
          const ghostIndex = e.data.ghostIndex;
          this.ghosts[ghostIndex].path = e.data.path;
          pathsProcessed++;
          if (pathsProcessed === totalGhosts) {
            worker.terminate();
          }
        };
      });
    },
    moveGhosts() {
      this.ghosts.forEach((ghost) => {
        if (ghost.path?.length > 0) {
          const nextPos = ghost.path[0];
          const dx = nextPos.x * this.cellWidth - ghost.position.x;
          const dy = nextPos.y * this.cellHeight - ghost.position.y;

          if (Math.abs(dx) > ghost.speed || Math.abs(dy) > ghost.speed) {
            ghost.position.x += Math.sign(dx) * ghost.speed;
            ghost.position.y += Math.sign(dy) * ghost.speed;
          } else {
            ghost.position.x = nextPos.x * this.cellWidth;
            ghost.position.y = nextPos.y * this.cellHeight;
            ghost.path.shift();
          }
        }
      });
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
