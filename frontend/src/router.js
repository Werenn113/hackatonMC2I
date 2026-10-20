import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ReplyPage from './pages/ReplyPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/reply/:id', component: ReplyPage, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
