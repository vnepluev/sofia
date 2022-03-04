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
        <q-card-section>
          <q-form @submit="submitForm" class="p-4 space-y-4">
            <!-- form data -->
            <quasar-input
              type="text"
              v-model="formData.fio"
              label="ваше имя"
              hint="н-р: Анна Васильевна"
            />

            <quasar-input type="tel" v-model="formData.phone" label="номер телефона" class="pt-6" />
            <quasar-input
              type="tel"
              v-model="formData.phone1"
              label="резервный номер"
              hint="не обязательное поле"
            />

            <quasar-input type="password" v-model="formData.password" label="пароль" class="pt-6" />
            <quasar-input
              type="password"
              v-model="formData.confirmPassword"
              label="пароль повторно"
            />

            <div class="mb-4"></div>
            <q-btn
              class="full-width bg-teal text-white"
              type="submit"
              label="Зарегистрироваться"
              :disable="!isFormValid"
            ></q-btn>
            <!-- /form data -->
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
      fio: '',
      phone: '',
      phone1: '',
      password: '',
      confirmPassword: '',
      email: '',
      telegram: '',
      howToFindUs: ''
    })

    const isFormValid = computed(() => formData.phone.length === 10 && formData.password.length > 5)

    return { formData, isFormValid }
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
.q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
