<template>
  <div class="score-lives-container">
    <div class="score">Score: {{ gameStore.score }}</div>
    <div class="lives">Lives: {{ gameStore.lives }}</div>
  </div>
  <div v-if="!gameStore.hasWon && !gameStore.gameOver" class="game" ref="gameElement">
    <canvas ref="gameCanvas"></canvas>
    <PacMan /> 
    <Ghost />
  </div>  
  <div v-if="gameStore.hasWon" class="win-message">
    <h1>GG</h1>
    <button @click="levelCleared" class="restart-button">Continue</button>
  </div>
  <div v-if="gameStore.gameOver" class="win-message">
    <h1>Game Over x_x</h1>
    <button @click="restartGame" class="restart-button">Restart Game</button>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import PacMan from '../components/PacMan.vue';
import Ghost from '../components/Ghost_.vue';

export default {
  components: {
    PacMan,
    Ghost
  },
  setup() {
    const gameStore = useGameStore();
    const gameElement = ref(null);
    const gameCanvas = ref(null);

    const restartGame = () => {
      gameStore.resetGame();
      gameLoop();
    };

    const levelCleared = () => {
      gameStore.levelCleared();
      gameLoop();
    }

    const drawMap = () => {
      const canvas = gameCanvas.value;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const { map } = gameStore;

      canvas.width = gameStore.gameWidth;
      canvas.height = gameStore.gameHeight;

      const cellWidth = canvas.width / map[0].length;
      const cellHeight = canvas.height / map.length;

      gameStore.setCellDimensions(cellWidth, cellHeight);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
          const tile = map[row][col];

          let color = 'black';
          if (tile === '1' || tile === '2' || tile === '3' || tile === '4' || tile === '-' ||tile === '|' || tile === '[' || tile === ']') {
            color = 'rgb(0,0,153)'; // Wall
          }

          // Draw the tile
          ctx.fillStyle = color;
          ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

          if (tile === '.') { // Dots (food)
            ctx.fillStyle = 'rgb(153,153,153)';
            ctx.beginPath();
            ctx.arc(
              col * cellWidth + cellWidth / 2,
              row * cellHeight + cellHeight / 2,
              Math.min(cellWidth, cellHeight) / 8,
              0,
              2 * Math.PI
            );
            ctx.fill();
          } else if (tile === '^') { // Boosts (ability)
            ctx.fillStyle = 'rgb(153,0,0)';
            ctx.beginPath();
            ctx.arc(
              col * cellWidth + cellWidth / 2,
              row * cellHeight + cellHeight / 2,
              Math.min(cellWidth, cellHeight) / 6,
              0,
              2 * Math.PI
            );
            ctx.fill();
          }
        }
      }
    };

    const updateGameDimensions = () => {
      if (gameElement.value) {
        gameStore.setGameDimensions(gameElement.value.offsetWidth, gameElement.value.offsetHeight);
        drawMap();
        gameStore.setInitialPacManPositionAndSize();
        gameStore.setInitialGhostPosition();
      }
    };

    const handleKeydown = (event) => {
      event.preventDefault();
      const { key } = event;
      let newDirection = null;
      
      switch (key) {
        case 'ArrowUp':
          newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          newDirection = { x: 1, y: 0 };
          break;
      }
      
      if (newDirection) {
        gameStore.changeDirection(newDirection);
      }
    };

    const gameLoop = () => {
      if (gameStore.hasWon || gameStore.gameOver) {
        return;
      }
      gameStore.movePacMan();
      if (gameStore.ghostPath) {
        gameStore.moveGhost();
      }
      drawMap();
      requestAnimationFrame(gameLoop);
    };

    onMounted(() => {
      updateGameDimensions();
      window.addEventListener('resize', updateGameDimensions);
      window.addEventListener('keydown', handleKeydown);
      setInterval(() => {
        gameStore.updateGhostPath();
      }, 500);
      gameLoop();
    });

    return {
      gameElement,
      gameCanvas,
      gameStore,
      restartGame,
      levelCleared
    };
  },
};
</script>

<style scoped>
.game {
  position: relative;
  width: 80vw;
  height: 80vh;
  border: 2px solid white;
}

canvas {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
}

.win-message {
  text-align: center;
  margin-top: 20px;
  font-size: 2em;
  color: white;
}

.restart-button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1em;
  background-color: #333;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
}

.restart-button:hover {
  background-color: white;
  color: #333;
}
</style>