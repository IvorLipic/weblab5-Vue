<template>
  <div
    :style="{
      position: 'absolute',
      top: `${pacManPosition.y}px`,
      left: `${pacManPosition.x}px`,
      width: `${pacManRadius}px`,
      height: `${pacManRadius}px`,
      backgroundColor: 'yellow',
      borderRadius: '50%',
    }"
  ></div>
</template>

<script>
import { useGameStore } from "../stores/gameStore";
import { computed } from "vue";

export default {  
  setup() {
    const gameStore = useGameStore();

    // Reactive properties cause component to re-render enabling animation
    const pacManPosition = computed(() => gameStore.pacManPosition);
    const pacManRadius = computed(() => gameStore.pacManRadius); 

    return {
      pacManPosition,
      pacManRadius
    };
  },
};
</script>
