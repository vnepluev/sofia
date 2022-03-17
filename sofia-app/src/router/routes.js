const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        name: 'LoginIn',
        path: '',
        component: () => import('src/pages/auth/Index.vue'),
      },
      { path: '/register', component: () => import('pages/Register.vue') },
    ],
    meta: {
      auth: false,
    },
  },
  /**
   * Доступ для пользователя
   */
  {
    path: '/auth',
    component: () => import('layouts/ClientAreaLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/auth/news/Index.vue') },
      {
        path: '/auth/orders',
        component: () => import('src/pages/auth/orders/Index.vue'),
      },
      {
        path: '/auth/options',
        component: () => import('src/pages/auth/options/Index.vue'),
      },
    ],
    meta: {
      auth: true,
    },
  },
  /**
   * Доступ только для администратора
   */
  {
    path: '/admin',
    component: () => import('layouts/AdminAreaLayout.vue'),
    children: [
      {
        name: 'LoginInAdmin',
        path: '',
        component: () => import('src/pages/admin/news/Index.vue'),
      },
    ],
    meta: {
      auth: true,
      group: 'admin',
    },
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
