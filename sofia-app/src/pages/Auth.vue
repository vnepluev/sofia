<template>
  <q-page class="flex flex-center">
    <div class="p-4 space-y-4">
      <q-card-section class="bg-primary text-white rounded-borders rounded-xl">
        <div class="text-h6">Вход в систему</div>
      </q-card-section>

      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section class="space-y-2">
          <q-form class="space-y-2">
            <!-- В форму ввода телефона добавить mask="+7(###)###-##-##" unmasked-value -->
            <q-input
              v-model="formData.email"
              label="номер телефона"
              mask="+7 (###) ###-##-##"
              unmasked-value
              outlined
            ></q-input>
            <q-input v-model="formData.password" label="пароль" type="password" outlined></q-input>
            <q-btn class="full-width bg-primary text-white" label="Войти"></q-btn>
          </q-form>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'PageIndex',

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const formData = reactive({
      email: '',
      password: ''
    })

    return { formData }
  },

  methods: {
  }
});
</script>

<style lang="scss">
</style>
