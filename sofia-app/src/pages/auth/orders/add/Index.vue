<!-- Новый заказ -->
<template>
	<div class="q-pa-md q-gutter-sm">
		<q-breadcrumbs class="text-gray-400">
			<template v-slot:separator>
				<q-icon size="1.5em" name="chevron_right" color="primary" />
			</template>

			<q-breadcrumbs-el
				:class="{ 'text-primary': step > 0 }"
				label="Выбор услуг"
				icon="home"
				@click="step = 1"
			/>
			<q-breadcrumbs-el
				:class="{ 'text-primary': step > 1 }"
				label="Детали заказа"
				icon="widgets"
				@click="step = 2"
			/>
			<q-breadcrumbs-el
				:class="{ 'text-primary': step > 2 }"
				label="Подтверждение"
				icon="thumb_up"
				@click="step = 3"
			/>
		</q-breadcrumbs>
	</div>

	<!-- ШАГ 1-->
	<q-page class="flex flex-center content-start lg:content-center">
		<div class="p-4 space-y-4">
			<div class="w-72 q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4" @submit="nextStep">
						<!-- form data -->

						<q-select
							outlined
							v-model="formData.choiceYachtModel"
							:options="formData.choiceYacht"
							label="Выберите услугу"
						/>
						<q-input v-model="formData.date" type="date" hint="Выберите дату прогулки" />
						<q-input v-model="formData.time" type="time" @change="changeTime" hint="Время отправления" />
						<q-select
							outlined
							v-model="formData.durationValue"
							:options="formData.duration"
							label="Продолжительность"
						/>

						<!-- <div class="mb-4"></div>
						<q-checkbox
							class="text-right"
							left-label
							v-model="formData.agree"
							label="Согласие на обработку персональных данных"
							checked-icon="task_alt"
							unchecked-icon="highlight_off"
						/>
						<q-space />-->

						<q-btn
							class="full-width bg-teal text-white glossy"
							type="submit"
							label="Далее"
							:disable="!isForm1Valid"
						></q-btn>
						<!-- /form data -->
					</q-form>
				</q-card-section>
			</div>
		</div>
	</q-page>
	<!-- /ШАГ 1-->
</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {

	setup() {
		const formData = reactive({
			choiceYachtModel: 'Яхта "София"', // null,
			choiceYacht: ['Яхта "София"'],
			date: '2022-03-24', // null,
			time: '12:00', // null,
			duration: ['1 час', '1 час 30 мин', '2 часа', '2 часа 30 мин', '3 часа', '3 часа 30 мин', '4 часа'],
			durationValue: null
		})

		// этапы заполнения формы
		const step = ref(1)

		// проверка заполнения формы
		const isForm1Valid = computed(() => {
			const check1 = formData.choiceYachtModel?.length > 0 && formData.date?.length > 0
			const check2 = formData.time?.length > 0 && formData.durationValue?.length > 0
			const isValid = check1 === check2 && check1 === true

			return isValid
		})

		// корректируем время
		const changeTime = () => {
			const time = formData.time.split('')
			time[4] = '0'
			formData.time = time.join('')
		}

		// Переходим на шаг вперед
		const nextStep = () => {
			step.value += 1
		}

		return { formData, isForm1Valid, changeTime, step, nextStep }
	}
}
</script>

<style lang="scss" scoped>
</style>
