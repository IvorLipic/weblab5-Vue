import { createRouter, createWebHistory } from 'vue-router';
import Game from '../views/Game_.vue';
import HighScores from '../views/HighScores.vue';
import Settings from '../views/Settings_.vue';

const routes = [
  { path: '/', component: Game },
  { path: '/high-scores', component: HighScores },
  { path: '/settings', component: Settings },
  { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') } // 404 page
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
