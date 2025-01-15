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
    setup() {
      const gameStore = useGameStore();

      const ghostRadius = computed(() => gameStore.pacManRadius);
      const ghosts = computed(() => gameStore.ghosts);

      return {
        ghostRadius,
        ghosts
      };
    },
  };
  </script>
  