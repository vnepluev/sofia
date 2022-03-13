<!--
	https://quasar.dev/vue-components/tab-panels
	https://quasar.dev/vue-components/expansion-item
-->
<template>
	<quasar-alert v-model="isError" title="Ошибка!" :text="errorMessage"></quasar-alert>

	<!--
		Добавить уведомление, что все ок
		https://quasar.dev/quasar-plugins/notify
		<q-btn no-caps unelevated color="positive" @click="triggerPositive" :label="okMessage" />
	<q-btn round size="sm" color="positive" @click="showNotif('top-right')">
		<q-icon name="arrow_upward" class="rotate-45" />
	</q-btn>-->

	<!-- ext item -->
	<q-page class="flex flex-center">
		<div class="q-pa-md" style="width: 320px;">
			<q-card-section class="mb-2 glossy bg-primary text-white rounded-borders rounded-xl">
				<div class="text-h6 p-2">Настройки</div>
			</q-card-section>
			<q-list bordered class="rounded-borders">
				<q-expansion-item
					switch-toggle-side
					expand-separator
					icon="verified_user"
					label="Изменить пароль"
				>
					<q-card>
						<q-card-section>
							<q-form class="p-4 pt-2 space-y-4">
								<quasar-input type="password" v-model="password.currentPass" label="текущий пароль" />
								<quasar-input type="password" v-model="password.pass1" label="новый пароль" />
								<quasar-input type="password" v-model="password.pass2" label="новый пароль повторно" />
								<q-btn
									class="full-width bg-teal text-white"
									type="submit"
									label="Изменить"
									:disable="!isPasswordValid"
									@click="handleChangePassword"
								></q-btn>
							</q-form>
						</q-card-section>
					</q-card>
				</q-expansion-item>

				<q-expansion-item
					switch-toggle-side
					expand-separator
					icon="account_box"
					label="Контактные данные"
				>
					<q-card>
						<q-card-section>
							<q-form class="p-2 pt-0">
								<quasar-input
									type="fio"
									v-model="formData.fio"
									label="ваше имя"
									hint="н-р: Анна Николаевна"
								/>
								<quasar-input
									type="tel"
									v-model="formData.phone2"
									label="резервный номер телефона"
									class="pt-4"
								/>
								<div class="mt-4"></div>
								<q-btn
									class="full-width bg-teal text-white"
									type="submit"
									label="Изменить"
									:disable="!isDataValid"
									@click="handleChangePhone"
								></q-btn>
							</q-form>
						</q-card-section>
					</q-card>
				</q-expansion-item>

				<q-expansion-item
					switch-toggle-side
					expand-separator
					icon="circle_notifications"
					label="Telegram bot"
				>
					<q-card>
						<q-card-section>
							Для подключения
							<a
								class="text-primary"
								href="https://telegram.me/yacht_sofia_bot"
								target="_blank"
							>@yacht_sofia_bot</a> запустите его в приложении Telegram и нажмите кнопку "Регистрация".
							<br />
							<br />После сообщения "Бот успешно подключен", вам будут доступны дополнительные опции.
						</q-card-section>
					</q-card>
				</q-expansion-item>
			</q-list>
		</div>
	</q-page>
	<!-- /ext item -->
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'
import QuasarInput from 'src/components/UI/QuasarInput.vue'
import { checkPassword, checkPhone, checkFio } from 'src/components/Helpers/CheckData.js'

export default defineComponent({
	setup() {
		const isError = ref(false)
		const errorMessage = ref('')

		const $store = useStore()
		const getMe = computed(() => $store.getters['auth/getMe']) // получаем информацию о пользователе

		const formData = reactive({
			...getMe.value,
		})
		const password = reactive({
			currentPass: '123456',
			pass1: '1234567',
			pass2: '1234567',
			username: formData.username
		})

		// проверка введенных данных
		const isPasswordValid = computed(() => {
			const step1 = password.pass1 === password.pass2
			const step2 = checkPassword(password.pass1)
			const step3 = checkPassword(password.currentPass)
			const step4 = password.currentPass !== password.pass1
			return !!((step1 && step2 && step3 && step4))
		})
		const isDataValid = computed(() => {
			// 1. formData.fio -> true && formData.phone2 = ''
			// 2. formData.fio -> true && formData.phone2.length === 10
			const ch1 = checkFio(formData.fio) // всегда true
			const ch2 = checkPhone(formData.phone2)
			const ch3 = formData.phone2 === '' || formData.phone2 === undefined || formData.phone2 === null
			if (((ch1 === ch3) || (ch1 === ch2)) && ch1) return true
			return false
		})

		// нажали изменить имя и телефон
		const handleChangePhone = async () => {
			try {
				if (isDataValid.value) {
					await $store.dispatch('auth/changeUserDataAction', {
						fio: formData.fio,
						phone2: formData.phone2
					})
				}
			} catch (error) {
				isError.value = true
				errorMessage.value = `При изменении данных сервер вернул ошибку: ${error}`
			}
		}

		// нажали изменить пароль
		const handleChangePassword = async () => {
			try {
				if (isPasswordValid.value) {
					await $store.dispatch('auth/changePasswordAction', password)
				}
			} catch (error) {
				errorMessage.value = `При изменении пароля сервер вернул ошибку: ${error}`
				isError.value = true
			}
		}

		return { isError, errorMessage, formData, password, isPasswordValid, isDataValid, handleChangePhone, handleChangePassword }
	},
	components: { QuasarAlert, QuasarInput }
})
</script>

<style lang="scss" scoped>
.q-card__section--vert {
	padding: 0 16px 6px 16px;
}
</style>
