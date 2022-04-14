<!-- Новый заказ -->
<template>
	<!-- Если возникла ошибка -->
	<quasar-alert v-model="isError" title="Сервер вернул ошибку!" :text="errorMessage" />

	<!-- навигация по шагам формы -->
	<div class="q-pa-md q-gutter-sm">
		<q-breadcrumbs class="text-gray-400">
			<template v-slot:separator>
				<q-icon size="1.5em" name="chevron_right" color="primary" />
			</template>

			<q-breadcrumbs-el :class="{ 'text-primary': step > 0 }" class="cursor-pointer" label="Выбор услуг" icon="home"
				@click="step = 1" />
			<q-breadcrumbs-el :class="{ 'text-primary': step > 1, 'cursor-not-allowed': !isForm1Valid }"
				class="cursor-pointer" label="Детали заказа" icon="widgets" @click="isForm1Valid ? step = 2 : false" />
			<q-breadcrumbs-el :class="{ 'text-primary': step > 2, 'cursor-not-allowed': !isForm2Valid }"
				class="cursor-pointer" label="Подтверждение" icon="thumb_up" @click="isForm2Valid ? step = 3 : false" />
		</q-breadcrumbs>
	</div>

	<!-- ШАГ 1-->
	<q-page v-if="step === 1" class="flex flex-center content-start lg:content-center">
		<div class="p-4 space-y-4">
			<div class="w-72 q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4" @submit="nextStep">
						<!-- form data -->
						<q-select outlined v-model="formData.choiceYachtModel" :options="formData.choiceYacht"
							label="Выберите услугу" />
						<q-input v-model="formData.date" type="date" hint="Выберите дату прогулки" />
						<q-input v-model="formData.time" type="time" @change="changeTime" hint="Время отправления" />
						<q-select outlined v-model="formData.durationValue" :options="formData.duration"
							label="Продолжительность" />

						<q-checkbox class="text-right" left-label v-model="formData.isPromo" label="У меня есть промокод"
							checked-icon="task_alt" unchecked-icon="highlight_off" />

						<q-input v-if="formData.isPromo" v-model="formData.promocode" type="text" hint="Промокод" />

						<q-btn class="full-width bg-teal text-white glossy" type="submit" label="Далее"
							:disable="!isForm1Valid"></q-btn>
						<!-- /form data -->
					</q-form>
				</q-card-section>
			</div>
		</div>
	</q-page>
	<!-- /ШАГ 1-->

	<!-- ШАГ 2-->
	<q-page v-if="step === 2" class="flex flex-center content-start lg:content-center">
		<div class="p-4 space-y-4">
			<div class="w-72 q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4" @submit="nextStep">
						<!-- form data -->
						<div class="text-lg">Количество человек: {{ formData.people }}</div>

						<q-slider v-model="formData.people" :min="0" :max="12" :step="1" label label-always switch-label-side
							color="primary" style="padding: 0 10px;" />

						<div class="text-lg">Доп. опции</div>

						<!-- фотосессия -->
						<q-toggle v-model="formData.photoValue" icon="photo_camera" label="Фотосессия (3 000 руб.)" />

						<!-- ватрушки / сап борды -->
						<q-select outlined v-model="formData.supValue" :options="formData.sup" label="Сап борды" />
						<q-select outlined v-model="formData.waterCircleValue" :options="formData.waterCircle"
							label="Ватрушки" />

						<div class="flex justify-between">
							<q-btn class="w-1/3 bg-teal text-white glossy" type="submit" label="<<" @click="step = 1" />
							<q-btn class="w-3/5 bg-teal text-white glossy" type="submit" label="Далее >"
								:disable="!isForm2Valid" />
						</div>
						<!-- /form data -->
					</q-form>
				</q-card-section>
			</div>
		</div>
	</q-page>
	<!-- /ШАГ 2-->

	<!-- ШАГ 3 -->
	<q-page v-if="step === 3" class="flex flex-center content-start lg:content-center">
		<div class="p-4 space-y-4">
			<!-- Итоговая информация -->
			<q-card class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)">
				<q-card-section>
					<div class="text-center text-h6">Формируем заказ</div>
				</q-card-section>
			</q-card>

			<div class="w-72 q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4 font-bold" @submit.prevent="finalStep">
						<!-- form data -->
						<div class="text-sm">{{ formData.choiceYachtModel }}</div>
						<div class="text-sm">Гостей: {{ formData.people }} чел.</div>
						<div class="text-sm">Отправление: {{ formData.date }}, {{ formData.time }}</div>
						<div class="text-sm">Длительность: {{ formData.durationValue }}</div>
						<div v-if="formData.photoValue" class="text-sm">Включена фотосессия</div>

						<div class="text-sm">{{ formData.supValue }}</div>
						<div class="text-sm">{{ formData.waterCircleValue }}</div>

						<div class="text-sm">Стоимость: {{ totalAmountSum }} руб.</div>

						<q-card-section class="q-pt-none">
							<div class="text-sm text-primary">Ваши пожелания:</div>
							<q-input dense v-model="formData.comment" autogrow />
						</q-card-section>

						<div class="flex justify-between">
							<q-btn class="w-1/3 bg-teal text-white glossy" type="submit" label="<<" @click="step = 2"
								:disable="isSubmit" />
							<q-btn class="w-3/5 bg-teal text-white glossy" type="submit" label="Отправить"
								:disable="isSubmit" />
						</div>
						<!-- /form data -->
					</q-form>
				</q-card-section>
			</div>
		</div>
	</q-page>
	<!-- /ШАГ 3 -->
</template>

<script>
import { api } from 'src/boot/axios.js'
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'

import {
	rentYachtPrice,
	rentSupPrice,
	rentWaterCirclePrice,
	photoPrice,
	calcEndDate
} from '../../../../components/Helpers/CalculatePrice.js' // стоимость услуг

export default {
	setup() {
		const $q = useQuasar();
		const $router = useRouter();
		const formData = reactive({
			choiceYachtModel: 'Яхта "София"',
			choiceYacht: ['Яхта "София"'],
			date: '2022-04-15',
			time: '09:40',
			duration: ['1 час', '1 час 30 мин', '2 часа', '2 часа 30 мин', '3 часа', '3 часа 30 мин', '4 часа'],
			durationValue: '2 часа 30 мин',
			isPromo: false,
			promocode: '',
			// form2
			people: 1,
			photoValue: false,
			sup: ['Без сап борда', '1 сап борд (1 000 руб.)', '2 сап борда (2 000 руб.)'],
			supValue: 'Без сап борда',
			waterCircle: ['Без ватрушки', '1 ватрушка (500 руб.)', '2 ватрушки (1 000 руб.)'],
			waterCircleValue: 'Без ватрушки',
			// form3
			comment: ''
		});
		const isError = ref(false);
		const errorMessage = ref('');
		const isSubmit = ref(false) // блокируем кнопки навигации в момент отправки данных

		/**
		 * этапы заполнения формы
		 */
		const step = ref(3);

		// проверка заполнения 1 формы
		const isForm1Valid = computed(() => {
			const check1 = formData.choiceYachtModel?.length > 0 && formData.date?.length > 0;
			const check2 = formData.time?.length > 0 && formData.durationValue?.length > 0;
			const isValid = check1 === check2 && check1 === true;
			return isValid;
		});

		// проверка заполнения 2 формы
		const isForm2Valid = computed(() => formData.people > 0);

		// округляем время
		const changeTime = () => {
			const time = formData.time.split('');
			time[4] = '0';
			formData.time = time.join('');
		};

		// Переходим на шаг вперед
		const nextStep = () => {
			step.value += 1;
		};

		// Вычисляем общую стоимость
		const totalAmountSum = computed(() => {
			let totalAmount = rentYachtPrice(formData.duration, formData.durationValue).price;
			totalAmount += rentSupPrice(formData.sup, formData.supValue).price;
			totalAmount += rentWaterCirclePrice(formData.waterCircle, formData.waterCircleValue).price;
			if (formData.photoValue) { totalAmount += photoPrice(); }
			return totalAmount;
		});

		/**
		 * Выводим диалог подтверждения
		 */
		const autoClose = () => {
			let seconds = 3;

			const dialog = $q.dialog({
				title: 'Заказ успешно создан!',
				message: `До закрытия окна ${seconds} сек.`
			});

			const timer = setInterval(() => {
				seconds -= 1;
				if (seconds > 0) {
					dialog.update({
						message: `До закрытия окна ${seconds} сек.`
					});
				} else {
					clearInterval(timer);
					dialog.hide();
				}
			}, 1000);

			dialog.onOk(() => {
				seconds = 0;
			}).onDismiss(() => {
				clearTimeout(timer);
				$router.push('/auth/orders');
			});
		};

		/**
		 * Отправляем данные заказа на сервер
		 */
		const finalStep = async () => {
			// форматирование даты
			// new Date(year, month, date, hours, minutes, seconds, ms)
			const dateStartArr = formData.date.split('-');
			dateStartArr[1] -= 1 // месяц -1
			const timeStartArr = formData.time.split(':');
			const dateStart = new Date(...dateStartArr, ...timeStartArr);
			const dateEnd = calcEndDate(dateStart, formData.duration, formData.durationValue);
			let yachtName = '';

			if (formData.choiceYachtModel === 'Яхта "София"') { yachtName = 'sofia'; }

			// итоговые данные
			const finalData = {
				yacht_name: yachtName,
				people_count: formData.people,
				comment: formData.comment,
				date_start: dateStart.toISOString(),
				date_end: dateEnd.toISOString(),
				promocode: formData.promocode,
				sup_board: 0,
				photo: 0,
				water_circle: 0 // количество ватрушек
			};

			if (formData.photoValue) { finalData.photo = 1; }

			finalData.sup_board = rentSupPrice(formData.sup, formData.supValue).count;
			finalData.water_circle = rentWaterCirclePrice(formData.waterCircle, formData.waterCircleValue).count;

			// отправляем данные на сервер
			isSubmit.value = true
			try {
				await api.post('/create-order', finalData).then(() => {
					// если ок
					autoClose();
				});
			} catch (error) {
				if (error.response.status === 405) {
					errorMessage.value = 'Извините, выбранное вами время было забронировано ранее';
				} else {
					errorMessage.value = error.toString();
				}
				isError.value = true;
			} finally {
				isSubmit.value = false // кнопки управления делаем активными
			}
			// console.log('Final data:', finalData);
		};

		return {
			formData,
			isForm1Valid,
			isForm2Valid,
			changeTime,
			step,
			nextStep,
			finalStep,
			totalAmountSum,
			isError,
			errorMessage,
			isSubmit
		};
	},
	components: { QuasarAlert }
}
</script>
