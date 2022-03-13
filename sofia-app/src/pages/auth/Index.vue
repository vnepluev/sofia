<template>
  <!-- сообщение об ошибке -->
  <quasar-alert v-model="isError" title="Сервер вернул ошибку!" :text="errorMessage"></quasar-alert>

  <q-page class="flex flex-center">
    <div class="p-4 space-y-4">
      <q-card-section class="glossy bg-primary text-white rounded-borders rounded-xl">
        <div class="text-h6">Вход в систему</div>
      </q-card-section>

      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section>
          <q-form class="p-4 space-y-4" @submit="submitForm">
            <quasar-input type="tel" v-model="formData.identifier" label="номер телефона" />
            <quasar-input type="password" v-model="formData.password" label="пароль" />

            <div class="mb-4"></div>
            <q-btn
              class="glossy full-width bg-primary text-white"
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
import { defineComponent, reactive, ref, computed } from 'vue'
import { mapActions } from 'vuex'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'
import QuasarInput from '../../components/UI/QuasarInput.vue'

export default defineComponent({
  name: 'PageIndex',

  components: { QuasarInput, QuasarAlert },

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const formData = reactive({
      identifier: '9050224000',
      password: '123456',
    })

    const isFormValid = computed(() => formData.identifier.length === 10 && formData.password.length > 5)
    const isError = ref(false)
    const errorMessage = ref('')

    return { formData, isFormValid, isError, errorMessage }
  },

  methods: {
    ...mapActions('auth', ['doLoginAction']),
    async submitForm() {
      // логинимся на сервер
      try {
        await this.doLoginAction(this.formData)
        this.$router.push('/auth') // входим в систему
      } catch (error) {
        this.isError = true
        this.errorMessage = `Пожалуйста, проверьте правильность ввода логина и пароля, либо попробуйте войти позднее.\n\n${error}`
      }
    }
  }
})
</script>

<style lang="scss">
</style>
