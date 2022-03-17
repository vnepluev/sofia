import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default route(({ store }) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  })

  // проверка доступа к авторизованной зоне
  Router.beforeEach((to, from, next) => {
    const auth = store.getters['auth/isAuth']
    const group = () => {
      const res = store.getters['auth/getMe'].group === 'admin'
      return res
    }

    // если неавторизованный юзер переходит в клиентскую часть
    // или в админ часть
    // перебрасываем на страницу логина
    if (to.matched.some((record) => record.meta.group) && !group()) {
      next({
        name: 'LoginIn',
        query: {
          to: to.path,
        },
      })
    } else if (to.matched.some((record) => record.meta.auth) && !auth) {
      next({
        name: 'LoginIn',
        query: {
          to: to.path,
        },
      })
    } else next()
  })

  return Router
})
