<template>
  <q-page class="flex flex-center">
    <div class="profile-header full-width column flex-center">
      <q-img class="w-48" :style="avatarStyle" src="~assets/logo-blue.svg"></q-img>
      <q-scroll-observer @scroll="scrollHandler" />
      <!-- {{ scrollPosition }} -->
    </div>
    <div class="p-4 space-y-4">
      <q-card-section class="bg-primary text-white rounded-borders rounded-xl">
        <div class="text-h6">Войти в систему</div>
      </q-card-section>

      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section class="space-y-2">
          <q-form class="space-y-2">
            <!-- В форму ввода телефона добавить mask="+7(###)###-##-##" unmasked-value -->
            <q-input v-model="formData.email" label="e-mail" type="email" outlined></q-input>
            <q-input v-model="formData.password" label="пароль" filled type="password" outlined></q-input>
            <q-btn class="full-width bg-primary text-white" label="Войти"></q-btn>
          </q-form>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'PageIndex',

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const scrollPosition = ref(1)
    const maxWidth = computed(() => 7 - (-scrollPosition.value * 5))
    const avatarStyle = computed(() => ({
      opacity: scrollPosition.value,
      width: (`${maxWidth.value}rem`)
    }))
    const formData = reactive({
      email: '',
      password: ''
    })

    return { avatarStyle, formData }
  },

  methods: {
    scrollHandler(info) {
      this.scrollPosition = 1 - (info.position.top / 165)
    }
  }
});
</script>

<style lang="scss">
.profile-header {
  min-height: 260px;
}
</style>
