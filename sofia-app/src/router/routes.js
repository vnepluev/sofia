const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        name: 'LoginIn',
        path: '',
        component: () => import('src/pages/Auth.vue'),
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
      { path: '', component: () => import('src/pages/Auth.vue') },
      { path: '/admin', component: () => import('pages/admin/Index') },
    ],
    meta: {
      auth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
