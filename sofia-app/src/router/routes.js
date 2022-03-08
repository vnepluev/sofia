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

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
