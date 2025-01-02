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
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '[', ']', '.', '^', '.', '[', ']', '.', '.', '.', '[', ']', '.', '^', '.', '[', ']', '|'],
      ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
      ['|', '.', '.', '.', '[', '-', ']', '.', '.', '-', 'X', '-', '.', '.', '-', '-', '[', '-', ']', '|'],
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
      const nextX = Math.round(this.pacManPosition.x + this.pacManDirection.x * this.pacManSpeed);
      const nextY = Math.round(this.pacManPosition.y + this.pacManDirection.y * this.pacManSpeed);

      // Check map and boundary collisions
      if (this.isCellWalkable(nextX, nextY, this.pacManDirection) && this.isInGameBoundaries(nextX, nextY)) {
        this.pacManPosition.x = nextX;
        this.pacManPosition.y = nextY;
      }
    },
    isCellWalkable(nextX, nextY, direction) {
      const checkPoint = (x, y) => {
        const cellX = Math.floor(x / this.cellWidth);
        const cellY = Math.floor(y / this.cellHeight);
        const cellValue = this.map[cellY]?.[cellX];
        console.log(`Checking cell at (${cellX}, ${cellY}): ${cellValue}`);
        return cellValue === '.' || cellValue === 'b' || cellValue === '^'; // Walkable cells
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
      console.log("Walkable checks:", results);
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
    changeDirection(newDirection) {
      this.pacManDirection = newDirection;
    }
  }
});
