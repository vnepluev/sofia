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
        path: '/auth/orders/add',
        component: () => import('src/pages/auth/orders/add/Index.vue'),
      },
      {
        path: '/auth/orders/add/cert',
        component: () => import('src/pages/auth/orders/add/Certificate.vue'),
      },
      {
        path: '/auth/options',
        component: () => import('src/pages/auth/options/Index.vue'),
      },
      {
        path: '/auth/calendar',
        component: () => import('src/pages/auth/calendar/Index.vue'),
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
      {
        name: 'UserList',
        path: '/admin/user-list',
        component: () => import('src/pages/admin/user-list/Index.vue'),
      },
      {
        name: 'OrderList',
        path: '/admin/order-list',
        component: () => import('src/pages/admin/order-list/Index.vue'),
      },
      {
        name: 'orderListId',
        path: '/admin/order-list/:id',
        component: () => import('src/pages/admin/order-list/OrderListId.vue'),
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
