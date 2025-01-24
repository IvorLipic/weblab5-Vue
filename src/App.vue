<template>
  <div id="app">
    <nav class="nav-bar">
      <router-link to="/" class="nav-link">Game</router-link>
      <router-link to="/high-scores" class="nav-link">High Scores</router-link>
      <router-link to="/settings" class="nav-link">Settings</router-link>
    </nav>
    <!-- Router View will show the active route's component -->
    <router-view /> 
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  background-color:rgb(0, 0, 0);
  padding: 20px;
}

.nav-bar {
  display: flex;
  gap: 2em;
  justify-content: space-around;
  margin-bottom: 20px;
}

.nav-link {
  font-size: 18px;
  text-decoration: none;
  color:rgb(156, 34, 34);
}

.nav-link:hover {
  text-decoration: underline;
  background-color:rgb(41, 28, 28);
}
</style>
