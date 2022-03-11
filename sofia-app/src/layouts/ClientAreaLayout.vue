<!-- stepper - выбор шагов заказа -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <!-- The Header -->

          <q-toolbar-title class="text-h5">
            <q-icon size="1.9rem" name="img:logo.svg" />&nbsp;Прогулки на яхте
          </q-toolbar-title>
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" align="right" @click="toggleLeftDrawer" />
      </q-toolbar>
    </q-header>
    <!-- выпадающее меню -->
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <div class="mt-10"></div>
      <q-btn stretch flat class="text-primary w-full" to="/auth" v-if="isAuth">Новости</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/auth/orders" v-if="isAuth">Мои заказы</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/auth/options" v-if="isAuth">Настройки</q-btn>
      <q-btn stretch flat class="text-primary w-full" to="/" v-if="!isAuth">Войти</q-btn>
      <q-btn stretch flat class="text-primary w-full" @click="logout" v-else>Выйти</q-btn>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="text-white">
      <q-tabs switch-indicator>
        <q-route-tab icon="format_list_bulleted" to="/auth/orders" replace label="Заказы" />
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
