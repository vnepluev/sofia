<!-- stepper - выбор шагов заказа -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-teal text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- The Header -->

          <q-toolbar-title class="text-h5">
            <q-icon size="1.9rem" name="img:logo.svg" />&nbsp;Levanta las velas patrón
          </q-toolbar-title>
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" align="right" @click="toggleLeftDrawer" />
      </q-toolbar>
    </q-header>
    <!-- выпадающее меню -->
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <div class="mt-10"></div>
      <q-btn stretch flat class="text-primary w-full" to="/admin" v-if="isAuth">Новости</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/admin/order-list" v-if="isAuth">Заказы</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/admin/stat" v-if="isAuth">Статистика</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/auth/options" v-if="isAuth">Настройки</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/" v-if="!isAuth">Войти</q-btn>
      <q-btn stretch flat class="text-primary w-full" @click="logout" v-else>Выйти</q-btn>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="text-white">
      <q-tabs switch-indicator>
        <q-route-tab icon="public" to="/admin" replace label="News" />
        <q-route-tab icon="format_list_bulleted" to="/admin/order-list" replace label="Заказы" />
        <q-route-tab icon="group" to="/admin/user-list" replace label="Users" />
        <q-route-tab icon="assignment" to="/auth/options" replace label="Настройки" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutAdminArea',
  // если пользователь не вошел в систему
  // { store, currentRoute, previousRoute, redirect, ssrContext, urlPath, publicPath }
  preFetch({ store, redirect }) {
    // if (currentRoute.meta.group === 'admin') {}
    if (!store.getters['auth/isAuth']
      && store.getters['auth/getMe'].group !== 'admin') {
      return redirect({ path: '/' })
    }
    return true
  },
  methods: {
    logout() {
      api.defaults.headers.common.Authorization = ''
      this.$store.dispatch('auth/signOut')
      this.$router.push('/')
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuth'])
  },
  setup() {
    const rightDrawerOpen = ref(false)

    return {
      rightDrawerOpen,
      toggleLeftDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value
      }
    }
  }
}
</script>
