<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar class="m-1">
        <q-icon size="2rem" name="img:logo.svg" />
        <q-toolbar-title class="text-h5">Прогулки на яхте</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- (Optional) The Footer -->
    <q-footer>
      <q-tabs switch-indicator>
        <q-route-tab icon="anchor" to="/" replace label="Вход" />
        <q-route-tab icon="assignment" to="/register" replace label="Регистрация" />
      </q-tabs>
    </q-footer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'LayoutLogin',

  // если пользователь вошел в систему и пытается зайти на главную
  preFetch({ store, redirect }) {
    // если админ
    if (store.getters['auth/getMe'].group === 'admin' && store.getters['auth/isAuth']) {
      return redirect({ path: '/admin' })
    }

    // если вошел пользователь
    if (store.getters['auth/isAuth']) {
      return redirect({ path: '/auth' })
    }
    return true
  },

}
</script>
