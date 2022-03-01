<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header elevated>
      <q-toolbar class="m-1">
        <q-icon size="2rem" name="img:logo.svg" />
        <q-toolbar-title>Прогулки на яхте</q-toolbar-title>
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
import { ref } from 'vue'

export default {
  // name: 'LayoutName',

  setup() {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>
