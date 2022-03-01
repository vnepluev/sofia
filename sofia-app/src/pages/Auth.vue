<template>
  <q-page class="flex flex-center">
    <div class="p-4 space-y-4">
      <q-card-section class="bg-primary text-white rounded-borders rounded-xl">
        <div class="text-h6">Вход в систему</div>
      </q-card-section>

      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section class="space-y-2">
          <q-form class="space-y-2" @submit="submitForm">
            <!-- В форму ввода телефона добавить mask="+7(###)###-##-##" unmasked-value -->
            <q-input
              v-model="formData.phone"
              label="номер телефона"
              mask="+7 (###) ###-##-##"
              unmasked-value
              outlined
              :rules="[isPhoneValid]"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
            <q-input
              v-model="formData.password"
              label="пароль"
              type="password"
              outlined
              :rules="[isPasswordValid]"
              maxlength="32"
            >
              <template v-slot:prepend>
                <q-icon name="lock" class="block" />
              </template>
            </q-input>
            <q-btn
              class="full-width bg-primary text-white"
              type="submit"
              label="Войти"
              :disable="!isFormValid"
            ></q-btn>
          </q-form>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive, computed } from 'vue'

export default defineComponent({
  name: 'PageIndex',

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const formData = reactive({
      phone: '',
      password: ''
    })

    const isFormValid = computed(() => formData.phone.length === 10 && formData.password.length > 5)

    const isPhoneValid = (phone) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(phone.length === 10 || 'Введите корректный номер')
      }, 1000)
    })
    const isPasswordValid = (pass) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(pass.length > 5 || 'Введен короткий пароль')
      }, 1000)
    })

    return { formData, isPhoneValid, isPasswordValid, isFormValid }
  },

  methods: {
    submitForm() {
      // длинна телефона 10 символов без +7
      return false
    }
  }
});
</script>

<style lang="scss">
</style>
