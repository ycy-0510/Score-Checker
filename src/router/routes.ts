import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LoginPage.vue'), }],
  },
  {
    path: '/score',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ScorePage.vue'), }],
  },
  // {
  //   path: '/admin/upload',
  //   component: () => import('pages/AdminUpload.vue'),
  //   meta: { requiresAdmin: true }
  // },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
