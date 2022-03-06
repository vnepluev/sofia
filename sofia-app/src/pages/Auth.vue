<template>
  <!-- сообщение об ошибке -->
  <q-dialog v-model="isError" persistent transition-show="scale" transition-hide="scale">
    <q-card class="bg-red text-white" style="width: 300px">
      <q-card-section>
        <div class="text-h6">Сервер вернул ошибку!</div>
      </q-card-section>

      <q-card-section
        class="q-pt-none"
      >Пожалуйста проверьте правильность ввода логина и пароля, либо попробуйте войти позднее.</q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- /сообщение об ошибке -->

  <q-page class="flex flex-center">
    <div class="p-4 space-y-4">
      <q-card-section class="bg-primary text-white rounded-borders rounded-xl">
        <div class="text-h6">Вход в систему</div>
      </q-card-section>

      <div class="q-card rounded-borders rounded-xl whitespace-pre-line">
        <q-card-section>
          <q-form class="p-4 space-y-4" @submit="submitForm">
            <quasar-input type="tel" v-model="formData.identifier" label="номер телефона" />
            <quasar-input type="password" v-model="formData.password" label="пароль" />

            <div class="mb-4"></div>
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
import { defineComponent, reactive, ref, computed } from 'vue'
import { mapActions } from 'vuex'
import QuasarInput from '../components/UI/QuasarInput.vue'

export default defineComponent({
  name: 'PageIndex',

  components: { QuasarInput },

  // setup(props, { attrs, slots, emit, expose }) {
  setup() {
    const formData = reactive({
      identifier: '9050224000',
      password: '123456',
    })

    const isFormValid = computed(() => formData.identifier.length === 10 && formData.password.length > 5)
    const isError = ref(false)

    return { formData, isFormValid, isError }
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
      }
    }
  }
})
</script>

<style lang="scss">
</style>
