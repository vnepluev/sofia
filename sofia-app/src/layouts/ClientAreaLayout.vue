<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>Title
          <q-btn stretch flat to="/" v-if="!isAuth">Войти</q-btn>
          <q-btn stretch flat @click="logout" v-else>Выйти</q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { mapGetters } from 'vuex'

export default {
  // preFetch({ store, redirect }) {
  //   // ...mapGetters('auth', ['isAuth'])
  //   console.log(store.getters)
  //   if (!store.getters) {
  //     redirect({ path: '/' })
  //   }
  // },
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
