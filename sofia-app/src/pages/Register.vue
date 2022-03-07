<!--
  фио
  номер телефона (основной, используется для входа -> username)
  номер phone2 (резервный)
  пароль
  повтор пароля
  e-mail
  t.me/nick_name ник в телеграм
  как о нас узнали
  я принимаю условия обработки персональных данных
 -->

<template>
  <quasar-alert
    v-model="isError"
    title="Ошибка регистрации!"
    text="Возможно пользователь с текущим номером телефона зарегистрирован. Возможно проблемы на сервере. Попробуйте позднее."
  ></quasar-alert>

  <q-page class="flex flex-center">
    <div class="p-4 space-y-4">
      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section>
          <q-form class="p-4 space-y-4" @submit="submitForm">
            <!-- form data -->
            <quasar-input
              type="fio"
              v-model="formData.fio"
              label="ваше имя"
              hint="н-р: Анна Николаевна"
            />
            <quasar-input
              type="tel"
              v-model="formData.username"
              label="номер телефона"
              class="pt-4"
            />
            <quasar-input type="email" v-model="formData.email" label="e-mail адрес" />
            <!--
            <quasar-input
              type="tel"
              v-model="formData.username1"
              label="резервный номер"
              hint="не обязательное поле"
            />-->

            <quasar-input type="password" v-model="formData.password" label="пароль" />
            <quasar-input
              type="password"
              v-model="formData.confirmPassword"
              label="пароль повторно"
            />

            <div class="mb-4"></div>
            <q-checkbox
              class="text-right"
              left-label
              v-model="formData.agree"
              label="Согласие на обработку персональных данных"
              checked-icon="task_alt"
              unchecked-icon="highlight_off"
            />
            <q-space />

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
import { defineComponent, ref, reactive, computed } from 'vue'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'
import QuasarInput from '../components/UI/QuasarInput.vue'
import { checkFio, checkEmail, checkPassword, checkPhone } from '../components/Helpers/CheckData.js'

export default defineComponent({
  name: 'PageIndex',

  components: { QuasarInput, QuasarAlert },

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const isError = ref(false)
    const formData = reactive({
      fio: 'test',
      username: '9050224000',
      password: '123456',
      confirmPassword: '123456',
      email: '1@mail.ru',
      agree: false
    })

    // проверка заполнения формы
    const isFormValid = computed(() => {
      const chFio = checkFio(formData.fio)
      const chPhone = checkPhone(formData.username)
      const chPassword = checkPassword(formData.password)
        && checkPassword(formData.confirmPassword)
        && formData.password === formData.confirmPassword
      const chEmail = checkEmail(formData.email)
      return chFio && chPhone && chPassword && chEmail && formData.agree
    })

    return { formData, isFormValid, isError }
  },

  methods: {
    async submitForm() {
      // регистрируем нового пользователя
      try {
        const prepareFormData = { ...this.formData }
        delete prepareFormData.confirmPassword
        await this.$store.dispatch('auth/registerNewUserAction', prepareFormData)
        this.$router.push('/auth') // входим в систему после регистрации
      } catch (error) {
        this.isError = true
        this.formData.agree = false
      }
    }
  }
});
</script>

<style lang="scss">
.q-field--with-bottom {
  padding-bottom: 0px;
}
</style>
