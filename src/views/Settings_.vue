<template>
    <div class="settings-container p-4 space-y-6">
      <div>
        <label for="pacman-speed" class="block text-sm font-medium text-gray-700">
          Pac-Man Speed
        </label>
        <input
          id="pacman-speed"
          type="range"
          min="1"
          max="10"
          v-model="gameStore.pacManSpeed"
          class="w-full mt-2"
        />
        <p class="text-sm text-gray-500">Current: {{ gameStore.pacManSpeed }}</p>
      </div>
  
      <div>
        <label for="ghost-speed" class="block text-sm font-medium text-gray-700">
          Ghost Speed
        </label>
        <input
          id="ghost-speed"
          type="range"
          min="1"
          max="10"
          v-model="ghostSpeed"
          class="w-full mt-2"
        />
        <p class="text-sm text-gray-500">Current: {{ ghostSpeed }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { useGameStore } from "../stores/gameStore";
  import { computed } from "vue";
  
  export default {
    setup() {
      const gameStore = useGameStore();
  
      const ghostSpeed = computed({
        get: () => gameStore.ghosts[0]?.speed || 1,
        set: (value) => {
          gameStore.ghosts.forEach((ghost) => {
            ghost.speed = value;
          });
        },
      });
  
      return {
        gameStore,
        ghostSpeed,
      };
    },
  };
  </script>
  
  <style scoped>
  .settings-container {
    background-color: 'black';
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  </style>
  