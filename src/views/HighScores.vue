<template>
    <div class="highscores">
      <h2>Highscores</h2>
      <ul v-if="highscores.length > 0">
        <li v-for="(score, index) in highscores" :key="index">
          <span>Score: {{ score.score }}</span>
          | Pac-Man Speed: {{ score.pacManSpeed }}
          | Ghost Speed: {{ score.ghostSpeed }}
        </li>
      </ul>
      <div v-else>
        <p>No highscores available yet.</p>
      </div>
    </div>
  </template>
  
<script>
import { fetchHighScores } from "../config/firebaseConfig.js";

export default {
  data() {
    return {
      highscores: [],
    };
  },
  mounted() {
    fetchHighScores().then((scores) => {
      this.highscores = scores.sort((a, b) => {
        // Compare by Ghost Speed (descending)
        if (b.ghostSpeed !== a.ghostSpeed) {
          return b.ghostSpeed - a.ghostSpeed;
        }
        // Compare by Pac-Man Speed (ascending)
        if (a.pacManSpeed !== b.pacManSpeed) {
          return a.pacManSpeed - b.pacManSpeed;
        }
        // Compare by Score (descending)
        return b.score - a.score;
      });
    });
  },
};
</script>

<style scoped>
.highscores {
  text-align: center;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  font-size: 18px;
}

p {
  font-size: 16px;
  color: gray;
}
</style>