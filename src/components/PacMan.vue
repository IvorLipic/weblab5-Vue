<!--8. b) Stateful component (uses gameStore) -->
<template>
  <div
    :style="{
      position: 'absolute',
      transform: `translate(${pacManPosition.x}px, ${pacManPosition.y}px)`,
      width: `${pacManRadius}px`,
      height: `${pacManRadius}px`,
      backgroundColor: 'yellow',
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

    // 4. Computed properties
    const pacManPosition = computed(() => gameStore.pacManPosition);
    const pacManRadius = computed(() => gameStore.pacManRadius); 

    return {
      pacManPosition,
      pacManRadius
    };
  },
};
</script>
