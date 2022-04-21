<template>
	<q-page class="flex flex-center content-start lg:content-center">
		<div class="p-4 space-y-4">
			<div class="w-full q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4">
						<!-- form data -->

						<!-- Если ошибка сервера -->
						<quasar-alert v-model="isError" title="Сервер вернул ошибку" :text="errorMessage" />

						<!-- Информация -->
						<div class="inline" style="max-width: 760px">
							<div class="flex flex-center text-center q-pa-md font-medium bg-yellow-100 rounded-borders">
								{{
									item.date_skip === 0 ? 'Для изменения даты внесите доплату 500 руб.'
										: `Количество доступных переносов даты: ${item.date_skip}`
								}}
								<br>
								За 24 часа до старта возможность редактирования данных пропадает.
							</div>
						</div>

						<!-- Дата начала / завершения -->
						<div class="flex justify-around" :class="{ 'block-danger': isFormValidInterval }">
							<div class="mr-3 flex p-2 pt-0" :class="{ 'block-danger': isErrorStartDate }">
								<q-input :disable="item.date_skip === 0" v-model="item.date" type="date" class="mr-3"
									hint="дата начала" />
								<q-input :disable="item.date_skip === 0" v-model="item.time" type="time"
									@change="changeStartTime" hint="время" />
							</div>
							<div class="mr-3 flex p-2 pt-0" :class="{ 'block-danger': isErrorEndDate }">
								<q-input :disable="item.date_skip === 0" v-model="item.dateEnd" type="date" class="mr-3"
									hint="дата завершения" />
								<q-input :disable="item.date_skip === 0" v-model="item.timeEnd" type="time"
									@change="changeEndTime" hint="время" />
							</div>
						</div>

						<div class="flex">
							<div class="text-lg mt-4">Количество человек: {{ item.people_count }}</div>
							<q-slider v-model="item.people_count" :min="1" :max="12" label switch-label-side color="primary"
								style="padding: 0 10px;" />
						</div>

						<div class="flex">
							<!--	Купон 000000-0000-0000
									Код бронирования 000
									Пин код 0000 -->
							<q-input v-model="item.sert_number" mask="XX####-####-####" hint="Номер купона"
								style="margin-top: -0.9rem;" class="mr-2" />
							<q-input v-model="item.sert_booking_code" mask="###" hint="Код бронирования"
								style="margin-top: -0.9rem;" class="mr-2" />
							<q-input v-model="item.sert_done_code" mask="####" hint="Код подтверждения"
								style="margin-top: -0.9rem;" />
						</div>

						<q-input style="margin-top: -1rem;" v-model="item.promocode" type="text"
							hint="Промокод (если есть)" />

						<div class="text-lg">Доп. опции:</div>
						<!-- фотосессия -->
						<q-toggle v-model="item.photoValue" icon="photo_camera" label="Фотосессия (3 000 руб.)" />

						<!-- ватрушки / сап борды -->
						<q-select outlined v-model="item.supValue" :options="item.sup" label="Сап борды" />
						<q-select outlined v-model="item.waterCircleValue" :options="item.waterCircle" label="Ватрушки" />

						<!-- пожелания -->
						<div>
							<div class="text-lg">Ваши пожелания:</div>
							<q-input dense v-model="item.comment" autogrow />
						</div>

						<div class="flex justify-between">
							<q-btn class="w-1/3 bg-teal text-white glossy" type="button" label="Назад"
								@click="$emit('close')" />
							<q-btn class="w-3/5 bg-teal text-white glossy" type="submit" label="Сохранить"
								@click="emit('change', item)" :disable="!isFormValid" />
						</div>

						<!-- /form data -->
					</q-form>
				</q-card-section>
			</div>
		</div>
	</q-page>

</template>

<script>
import { ref, watch } from 'vue'
import { formatDateTime } from 'src/components/Helpers/FormatData.js'
import { api } from 'src/boot/axios'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'

export default {
	props: {
		data: {
			type: Object,
			require: true
		}
	},
	emits: ['close', 'change'],
	setup(props) {
		// данные лежат в item
		const item = ref(JSON.parse(JSON.stringify(props.data)));
		const isFormValid = ref(false);
		const isFormValidInterval = ref(false);
		const errorMessage = ref('')
		const isError = ref(false)

		// преобразуем дату и время
		const startDate = formatDateTime(item.value.date_start);
		// eslint-disable-next-line prefer-destructuring
		item.value.date = startDate[0];
		// eslint-disable-next-line prefer-destructuring
		item.value.time = startDate[1];

		const endDate = formatDateTime(item.value.date_end);
		// eslint-disable-next-line prefer-destructuring
		item.value.dateEnd = endDate[0];
		// eslint-disable-next-line prefer-destructuring
		item.value.timeEnd = endDate[1];

		// фото
		item.value.photoValue = item.value.photo > 0;

		// сапы / ватрушки
		item.value.sup = ['Без сап борда', '1 сап борд (1 000 руб.)', '2 сап борда (2 000 руб.)'];
		item.value.supValue = item.value.sup[item.value.sup_board];
		item.value.waterCircle = ['Без ватрушки', '1 ватрушка (500 руб.)', '2 ватрушки (1 000 руб.)'];
		item.value.waterCircleValue = item.value.waterCircle[item.value.water_circle];

		// округляем время
		const changeStartTime = () => {
			const time = item.value.time.split('');
			time[4] = '0';
			item.value.time = time.join('');
		};

		const changeEndTime = () => {
			const time = item.value.timeEnd.split('');
			time[4] = '0';
			item.value.timeEnd = time.join('');
		};

		// проверяем даты
		const isErrorStartDate = ref(false);
		const isErrorEndDate = ref(false);

		watch([
			() => item.value.date,
			() => item.value.time,
			() => item.value.dateEnd,
			() => item.value.timeEnd
		], async (newValue) => {
			const newStartDate = Date.parse(`${newValue[0]}T${newValue[1]}`);

			if (Number.isNaN(newStartDate)) {
				isErrorStartDate.value = true;
			} else {
				isErrorStartDate.value = false;
			}

			const newEndDate = Date.parse(`${newValue[2]}T${newValue[3]}`);
			if (Number.isNaN(newEndDate)) {
				isErrorEndDate.value = true;
			} else {
				isErrorEndDate.value = false;
			}

			const dateS = new Date(`${newValue[0]}T${newValue[1]}`)
			const dateE = new Date(`${newValue[2]}T${newValue[3]}`)

			if ((dateE - dateS) < 0) {
				isFormValidInterval.value = true;
			} else if (!Number.isNaN(newStartDate) && !Number.isNaN(newEndDate)) {
				let entries;
				try {
					entries = await api.post('/check-data-interval', {
						id: item.value.id,
						yacht_name: item.value.yacht_name,
						date_start: new Date(`${newValue[0]}T${newValue[1]}`).toUTCString(),
						date_end: new Date(`${newValue[2]}T${newValue[3]}`).toUTCString(),
					});
				} catch (error) {
					errorMessage.value = error.toString();
					isError.value = true
				}

				// если интервал свободен
				if (entries?.status === 204) {
					isFormValidInterval.value = false;
				}

				// если интервал занят
				if (entries?.data?.status === 'busy' || entries?.data?.length > 0) {
					isFormValidInterval.value = true;
				}
			}
		});

		// проверка, менялись ли данные в заказе
		watch(item.value, () => {
			if (!isErrorStartDate.value && !isErrorEndDate.value) { isFormValid.value = true; } else { isFormValid.value = false; }
		});
		return {
			item,
			isFormValid,
			isFormValidInterval,
			changeStartTime,
			changeEndTime,
			isErrorStartDate,
			isErrorEndDate,
			isError,
			errorMessage,

		};
	},
	components: { QuasarAlert }
}
</script>

<style lang="scss" scoped>
.block-danger {
	border: 1px solid red;
	border-radius: 15px;
}
</style>
