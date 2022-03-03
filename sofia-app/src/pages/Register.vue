<!--
  фио
  номер телефона (основной, используется для входа -> username)
  номер телефона (резервный)
  пароль
  повтор пароля
  e-mail
  t.me/nick_name ник в телеграм
  как о нас узнали
  я принимаю условия обработки персональных данных
 -->

<template>
  <q-page class="flex flex-center">
    <div class="p-4 space-y-4">
      <q-card-section class="bg-teal text-white rounded-borders rounded-xl">
        <div class="text-h6">Регистрация</div>
      </q-card-section>

      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section class="space-y-2">
          <q-form class="space-y-2" @submit="submitForm">
            <!-- В форму ввода телефона добавить mask="+7(###)###-##-##" unmasked-value -->

            <quasar-input type="tel" v-model="formData.phone" @isValid="isPhoneValid" />
            <!-- <quasar-input type="password" v-model="formData.password" @isValid="isPasswordValid" /> -->

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
              class="full-width bg-teal text-white"
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
import QuasarInput from '../components/UI/QuasarInput.vue';

export default defineComponent({
  name: 'PageIndex',

  components: { QuasarInput },

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const formData = reactive({
      phone: '',
      password: ''
    })

    const isPhoneValid = (isValid) => (typeof isValid === 'boolean')
    const isPasswordValid = (pass) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(pass.length > 5 || 'Введен короткий пароль')
      }, 1000)
    })

    const isFormValid = computed(() => isPhoneValid && formData.password.length > 5)

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
