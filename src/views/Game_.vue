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
import { onMounted, ref, getCurrentInstance, onBeforeUnmount } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import PacMan from '../components/PacMan.vue';
import Ghost from '../components/Ghost_.vue';

export default {

  components: {
    PacMan,
    Ghost
  },

  methods: {
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
    const gameElement = ref(null);
    const gameCanvas = ref(null);
    let ghostPathInterval;

    //Required for accessing functions in the methods property
    const instance = getCurrentInstance();

    const restartGame = () => {
      gameStore.resetGame();
      setWorkerInterval();
      gameLoop();
    };

    const levelCleared = () => {
      gameStore.levelCleared();
      setWorkerInterval();
      gameLoop();
    }

    const setWorkerInterval = () => {
      ghostPathInterval = setInterval(() => {
        gameStore.calculateGhostPaths();
        console.log("Calculating path.");
      }, 100);
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
          }
        }
      }
    };

    const updateGameDimensions = () => {
      if (gameElement.value) {
        gameStore.setGameDimensions(gameElement.value.offsetWidth, gameElement.value.offsetHeight);
        drawMap();
        gameStore.setInitialPacManPositionAndSize();
        //gameStore.setInitialGhostPosition();
        gameStore.setInitialGhostPositions();
      }
    };

    const gameLoop = () => {
      if (gameStore.hasWon || gameStore.gameOver) {
        stopWorkerPathfinding();
        return;
      } 

      gameStore.movePacMan();
      gameStore.moveGhosts();
      drawMap();

      // Check collisions
      gameStore.ghosts.forEach((ghost) => {
        if (gameStore.checkCollisionAndReset(ghost)) {
          gameStore.lives -= 1;
          if (gameStore.lives <= 0) {
            gameStore.gameOver = true;
          }
        }
      });

      requestAnimationFrame(gameLoop);
    };

    onMounted(() => {
      updateGameDimensions();
      window.addEventListener('resize', updateGameDimensions);
      window.addEventListener('keydown', instance.proxy.handleKeydown);
      setWorkerInterval();
      gameLoop();
    });

    onBeforeUnmount(() => {
      // Clean up listeners and intervals when the component is destroyed
      window.removeEventListener('resize', updateGameDimensions);
      window.removeEventListener('keydown', instance.proxy.handleKeydown);
      stopWorkerPathfinding();
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