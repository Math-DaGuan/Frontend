import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/home/Index.vue'),
        },
        {
          path: 'category/:id',
          name: 'category',
          component: () => import('../views/category/CategoryView.vue'),
          meta: { title: '章节目录' }
        },
        {
          path: 'practice/:categoryId',
          name: 'practice',
          component: () => import('../views/practice/QuestionList.vue'),
          meta: { title: '题目练习' }
        },
        {
          path: 'mistakes',
          name: 'mistakes',
          component: () => import('../views/profile/WrongBook.vue'),
          meta: { title: '错题本' }
        },
        {
          path: 'favorites',
          name: 'favorites',
          component: () => import('../views/profile/Favorites.vue'),
          meta: { title: '收藏本' }
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const baseTitle = '大观墙';
  const subTitle = to.meta.title as string;
  document.title = subTitle ? `${subTitle} - ${baseTitle}` : baseTitle;
});

export default router;
