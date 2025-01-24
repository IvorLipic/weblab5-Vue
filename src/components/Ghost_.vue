<!--8. b) Stateful component (uses gameStore) -->
<template>
    <div
      v-for="ghost in ghosts"
      :key="ghost.color"
      :style="{
        position: 'absolute',
        transform: `translate(${ghost.position.x}px, ${ghost.position.y}px)`,
        width: `${ghostRadius}px`,
        height: `${ghostRadius}px`,
        backgroundColor: ghost.color,
        borderRadius: '50%',
        zIndex: 10
      }"
    ></div>
  </template>
  
  <script>
  import { useGameStore } from "../stores/gameStore";
  import { computed } from "vue";
  
  export default {
    emits: ["collision"],
    setup(_, { emit }) {
      const gameStore = useGameStore();
      const ghostRadius = computed(() => gameStore.pacManRadius);
      const ghosts = computed(() => gameStore.ghosts);

      // Move ghosts and check for collision
      const updateGhosts = () => {
        gameStore.moveGhosts();
        gameStore.ghosts.forEach((ghost) => {
          if (gameStore.checkCollisionAndReset(ghost)) {
            emit("collision"); // 9. Emit event
          }
        });
      };

      return {
        ghostRadius,
        ghosts,
        updateGhosts
      };
    },
  };
  </script>
  