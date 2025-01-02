<template>
  <div class="score-lives-container">
    <div class="score">Score: {{ score }}</div>
    <div class="lives">Lives: {{ lives }}</div>
  </div>
  <div class="game" ref="gameElement">
    <canvas ref="gameCanvas"></canvas>
    <PacMan /> 
  </div>  
</template>

<script>
import { onMounted, ref } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import PacMan from '../components/PacMan.vue';

export default {
  components: {
    PacMan,
  },
  setup() {
    const gameStore = useGameStore();
    const gameElement = ref(null);
    const gameCanvas = ref(null);

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
            color = 'rgb(0,0,153)';
          } else if (tile === 'X') {
            color = 'rgb(153,0,0)';  
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
        gameStore.setInitialPacManPositionAndSize();
        drawMap();
      }
    };

    const gameLoop = () => {
      gameStore.movePacMan();
      drawMap();
      requestAnimationFrame(gameLoop);
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

    onMounted(() => {
      updateGameDimensions();
      gameStore.setInitialPacManPositionAndSize();
      window.addEventListener('resize', updateGameDimensions);
      window.addEventListener('keydown', handleKeydown);
      gameLoop();
    });

    return {
      gameElement,
      gameCanvas,
      score: gameStore.score,
      lives: gameStore.lives,
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
</style>