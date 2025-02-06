<template>
  <div class="score-lives-container">
    <div class="score">Score: {{ gameStore.score }}</div> <!-- 1. Interpolation/one-way binding -->
    <div class="lives">Lives: {{ gameStore.lives }}</div> <!-- 1. Interpolation/one-way binding -->
  </div>
  <div v-if="!gameStore.hasWon && !gameStore.gameOver" class="game" ref="gameElement">
    <canvas ref="gameCanvas"></canvas>
    <PacMan /> 
    <Ghost ref="ghostComponent" @collision="handleCollision"/>
  </div>    
  <div v-if="gameStore.hasWon" class="win-message">
    <h1>GG</h1>
    <button @click="levelCleared" class="restart-button">Continue</button>
  </div>
  <div v-if="gameStore.gameOver" class="win-message">
    <h1>Game Over</h1>
    <button @click="restartGame" class="restart-button">Restart Game</button>
    <button 
      v-if="!gameStore.scoreSaved" 
      @click="saveScore" 
      class="save-score-button">
      Save Score
    </button>
  </div>
</template>

<script>
import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import PacMan from '../components/PacMan.vue';
import Ghost from '../components/Ghost_.vue';

export default {
  components: {
    PacMan,
    Ghost
  },
  methods: { // 3. Methods
    handleKeydown(event) {
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
        this.gameStore.changeDirection(newDirection);
      }
    }
  },
  setup() {
    const gameStore = useGameStore();
    const ghostComponent = ref(null);
    const gameElement = ref(null);
    const gameCanvas = ref(null);
    const gameLoopId = ref(null);

    //Required for accessing functions in the methods property
    const instance = getCurrentInstance();

    let ghostPathInterval;

    const restartGame = () => {
      updateGameDimensions();
      gameStore.resetGame();
      setWorkerInterval();
      gameLoop();
    };

    const levelCleared = () => {
      updateGameDimensions();
      gameStore.levelCleared();
      setWorkerInterval();
      gameLoop();
    }

    const saveScore = () => {
      gameStore.saveGameResults();
    }

    let isCalculatingPaths = false;

    const setWorkerInterval = () => {
      ghostPathInterval = setInterval(async () => {
        if (isCalculatingPaths) return; // Prevent overlapping calculations
        isCalculatingPaths = true;
        await gameStore.calculateGhostPaths();
        isCalculatingPaths = false;
      }, 200);
    };

    const stopWorkerPathfinding = () => {
      if (ghostPathInterval) {
        clearInterval(ghostPathInterval);
        ghostPathInterval = null;
      }
    };

    const drawMap = () => {
      const canvas = gameCanvas.value;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const { map } = gameStore;

      canvas.width = gameStore.gameWidth;
      canvas.height = gameStore.gameHeight;

      const cellWidth = gameStore.gameWidth / map[0].length;
      const cellHeight = gameStore.gameHeight / map.length;

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
          }
        }
      }
    };

    const handleCollision = () => {
      gameStore.lives -= 1;
    };

    const updateGameDimensions = () => {
      let width, height;

      if (gameElement.value) {
        // Use the actual gameElement dimensions if available
        width = gameElement.value.offsetWidth;
        height = gameElement.value.offsetHeight;
      } else {
        // Calculate fallback dimensions based on CSS styling
        const vw = window.innerWidth * 0.01; // 1% of the viewport width
        const vh = window.innerHeight * 0.01; // 1% of the viewport height
        width = 80 * vw; // 80vw
        height = 80 * vh; // 80vh
      }

      // Set game dimensions
      gameStore.setGameDimensions(width, height);
      gameStore.setCellDimensions(width / gameStore.map[0].length, height / gameStore.map.length);

      // Prepare map, PacMan and ghosts
      drawMap();
      gameStore.setInitialPacManPositionAndSize();
      gameStore.setInitialGhostPositions();
    };

    const gameLoop = () => {
      const loop = () => {
        if (gameStore.hasWon || gameStore.gameOver) {
          stopWorkerPathfinding();
          return;
        } 

        gameStore.movePacMan();
        ghostComponent.value.updateGhosts();
        drawMap();

        /*
        gameStore.ghosts.forEach((ghost) => {
          if (gameStore.checkCollisionAndReset(ghost)) gameStore.lives -= 1; // Continue the loop
        });
        */

        gameLoopId.value = requestAnimationFrame(loop);
      };
      gameLoopId.value = requestAnimationFrame(loop); // Start the loop
    };

    const stopGameLoop  = () => {
      if (gameLoopId.value) {
        cancelAnimationFrame(gameLoopId.value); // Stop the animation frame
        gameLoopId.value = null;
      }
    };

    // 6. Lifecycle hooks
    onMounted(() => {
      updateGameDimensions();
      window.addEventListener('resize', updateGameDimensions);
      window.addEventListener('keydown', instance.proxy.handleKeydown);
      setWorkerInterval();
      gameLoop();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateGameDimensions);
      window.removeEventListener('keydown', instance.proxy.handleKeydown);
      stopWorkerPathfinding();
      stopGameLoop();
    });

    return {
      gameElement,
      gameCanvas,
      gameStore,
      ghostComponent,
      restartGame,
      levelCleared,
      saveScore,
      handleCollision
    };
  },
};
</script>

<style scoped> /* 5. Scoped style */
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

.save-score-button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1em;
  background-color: #333;
  color: white;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
}

.restart-button:hover .save-score-button:hover {
  background-color: white;
  color: #333;
}
</style>