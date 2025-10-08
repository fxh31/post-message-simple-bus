import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue'),

      // children: [
      //   {
      //     path: 'about',
      //     name: 'About',
      //     component: () => import('../views/About.vue'),
      //   },
      // ],
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/About.vue'),
    },
  ],
})

export default router
