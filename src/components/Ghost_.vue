<template>
    <div
      :style="{
        position: 'absolute',
        transform: `translate(${ghostPosition.x}px, ${ghostPosition.y}px)`,
        width: `${ghostRadius}px`,
        height: `${ghostRadius}px`,
        backgroundColor: 'red',
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
  
      const ghostPosition = computed(() => gameStore.ghostPosition);
      const ghostRadius = computed(() => gameStore.pacManRadius);
  
      return {
        ghostPosition,
        ghostRadius
      };
    },
  };
  </script>
  