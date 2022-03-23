<!-- Новый заказ -->
<template>
	<div class="q-pa-md q-gutter-sm">
		<q-breadcrumbs class="text-primary">
			<template v-slot:separator>
				<q-icon size="1.5em" name="chevron_right" color="primary" />
			</template>

			<q-breadcrumbs-el label="Услуги" icon="home" to="/auth/auth/orders/add" />
			<q-breadcrumbs-el label="Детали заказа" icon="widgets" to="/auth/auth/orders/add/1" />
			<q-breadcrumbs-el label="Подтверждение" icon="thumb_up" to="/auth/auth/orders/add/2" />
		</q-breadcrumbs>
	</div>

	<q-page class="flex flex-center">
		<div class="p-4 space-y-4">
			<div class="q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4" @submit="submitForm">
						<!-- form data -->

						<q-input v-model="date" filled type="date" hint="Выберите дату прогулки" />
						<q-input v-model="time" filled type="time" hint="Время отправления" />

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
							class="full-width bg-teal text-white glossy"
							type="submit"
							label="Далее"
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
import { reactive } from 'vue'

export default {

	setup() {
		const formData = reactive({})

		return { formData }
	}
}
</script>

<style lang="scss" scoped>
</style>
