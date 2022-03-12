<!--
	https://quasar.dev/vue-components/tab-panels
	https://quasar.dev/vue-components/expansion-item
-->
<template>
	<quasar-alert
		v-model="isError"
		title="Ошибка регистрации!"
		text="Возможно пользователь с текущим номером телефона зарегистрирован. Возможно проблемы на сервере. Попробуйте позднее."
	></quasar-alert>

	<!-- ext item -->
	<q-page class="flex flex-center">
		<div class="q-pa-md" style="width: 320px;">
			<q-card-section class="mb-2 glossy bg-primary text-white rounded-borders rounded-xl">
				<div class="text-h6 p-2">Настройки</div>
			</q-card-section>
			{{ formData }}
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
		// const formData = reactive({
		// 	fio: 'test',
		// 	phone2: '9050224000',
		// 	password: '123456',
		// 	confirmPassword: '123456',
		// 	email: '1@mail.ru',
		// })

		const $store = useStore()
		const getMe = computed(() => $store.getters['auth/getMe']) // получаем информацию о пользователе

		const formData = reactive({
			...getMe.value,
		})
		const password = reactive({
			currentPass: '',
			pass1: '',
			pass2: ''
		})

		// проверка введенных данных
		const isPasswordValid = computed(() => password.pass1.value === password.pass2.value && checkPassword(password.pass1.value))
		const isDataValid = computed(() => checkPhone(formData.phone2) && checkFio(formData.fio))

		// нажали изменить имя и телефон
		const handleChangePhone = () => {

		}

		return { isError, formData, password, isPasswordValid, isDataValid, handleChangePhone }
	},
	components: { QuasarAlert, QuasarInput }
})
</script>

<style lang="scss" scoped>
.q-card__section--vert {
	padding: 0 16px 6px 16px;
}
</style>
