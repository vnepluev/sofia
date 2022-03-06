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
      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section>
          <q-form @submit="submitForm" class="p-4 space-y-4">
            <!-- form data -->
            <quasar-input
              type="fio"
              v-model="formData.fio"
              label="ваше имя"
              hint="н-р: Анна Николаевна"
            />
            <quasar-input type="tel" v-model="formData.phone" label="номер телефона" class="pt-4" />
            <quasar-input type="email" v-model="formData.email" label="e-mail адрес" />
            <!--
            <quasar-input
              type="tel"
              v-model="formData.phone1"
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
import { defineComponent, reactive, computed } from 'vue'
import QuasarInput from '../components/UI/QuasarInput.vue'
import { checkFio, checkEmail, checkPassword, checkPhone } from '../components/Helpers/CheckData.js'
import { mapActions } from 'vuex'

export default defineComponent({
  name: 'PageIndex',

  components: { QuasarInput },

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const formData = reactive({
      fio: '',
      phone: '',
      password: '',
      confirmPassword: '',
      email: '',
      agree: false
    })

    // проверка заполнения формы
    const isFormValid = computed(() => {
      const chFio = checkFio(formData.fio)
      const chPhone = checkPhone(formData.phone)
      const chPassword = checkPassword(formData.password)
        && checkPassword(formData.confirmPassword)
        && formData.password === formData.confirmPassword
      const chEmail = checkEmail(formData.email)
      return chFio && chPhone && chPassword && chEmail && formData.agree
    })

    return { formData, isFormValid }
  },

  methods: {
    // отправляем данные формы на сервер
    ...mapActions('auth', ['registerNewUserAction']),
    async submitForm() {
      // логинимся на сервер
      try {
        await this.registerNewUserAction(this.formData)
        this.$router.push('/auth') // входим в систему
      } catch (error) {
        this.isError = true
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
