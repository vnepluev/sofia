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

						<q-input
							outlined
							bottom-slots
							v-model="text"
							label="Label"
							counter
							maxlength="12"
							:dense="dense"
						>
							<template v-slot:before>
								<q-avatar>
									<img src="https://cdn.quasar.dev/img/avatar5.jpg" />
								</q-avatar>
							</template>

							<template v-slot:append>
								<q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
								<q-icon name="schedule" />
							</template>

							<template v-slot:hint>Field hint</template>

							<template v-slot:after>
								<q-btn round dense flat icon="send" />
							</template>
						</q-input>

						<quasar-input type="fio" v-model="formData.fio" label="ваше имя" hint="н-р: Анна Николаевна" />
						<quasar-input type="tel" v-model="formData.username" label="номер телефона" class="pt-4" />
						<quasar-input type="email" v-model="formData.email" label="e-mail адрес" />

						<quasar-input type="password" v-model="formData.password" label="пароль" />
						<quasar-input type="password" v-model="formData.confirmPassword" label="пароль повторно" />

						<div class="mb-4"></div>
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
import { defineComponent, ref, reactive } from 'vue'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'
import QuasarInput from 'src/components/UI/QuasarInput.vue'
// import { checkFio, checkEmail, checkPassword, checkPhone } from 'src/components/Helpers/CheckData.js'

export default defineComponent({
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

		return { isError, formData }
	},
	components: { QuasarAlert, QuasarInput }
})
</script>

<style lang="scss" scoped>
</style>
