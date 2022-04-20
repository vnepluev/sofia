<template>
	<!-- ШАГ 1-->
	<q-page class="flex flex-center content-start lg:content-center">
		<div class="p-4 space-y-4">
			<div class="w-full q-card rounded-borders rounded-xl whitespace-pre-line">
				<q-card-section>
					<q-form class="p-4 space-y-4">
						<!-- form data -->
						<div class="text-sm">
							{{
								item.date_skip === 0 ? 'Для изменения даты внесите доплату 500 руб.'
									: `Количество доступных переносов даты: ${item.date_skip}`
							}}
							<br>
							За 24 часа до старта возможность редактирования данных пропадает.
						</div>
						<div class="flex">
							<q-input :disable="item.date_skip === 0" v-model="item.date" type="date" class="mr-3"
								hint="дата начала" />
							<q-input :disable="item.date_skip === 0" v-model="item.time" type="time" @change="changeTime"
								hint="время" />
						</div>
						<q-select outlined v-model="item.durationValue" :options="item.duration" label="Продолжительность" />

						<div class="flex">
							<div class="text-lg">Количество человек: {{ item.people_count }}</div>
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
	<!-- /ШАГ 1-->

</template>

<script>
import { ref } from 'vue'
import { date } from 'quasar'

export default {
	props: {
		data: {
			type: Object,
			require: true
		}
	},
	emits: ['close', 'change'],
	setup(props) {
		const item = ref(JSON.parse(JSON.stringify(props.data)))

		// преобразуем дату и время
		const d = item.value.date_start.split(',')[0].split('.')
		const d1 = date.buildDate({ year: d[2], month: d[1], date: d[0] })

		const t = item.value.date_start.split(',')[1].split(':')
		const t1 = date.buildDate({ hours: t[0], minutes: t[1] })

		item.value.date = date.formatDate(d1, 'YYYY-MM-DD')
		item.value.time = date.formatDate(t1, 'HH:mm')

		// округляем время
		const changeTime = () => {
			const time = item.value.time.split('');
			time[4] = '0';
			item.value.time = time.join('');
		};

		// фото
		item.value.photoValue = item.value.photo > 0

		// сапы / ватрушки
		item.value.sup = ['Без сап борда', '1 сап борд (1 000 руб.)', '2 сап борда (2 000 руб.)']
		item.value.supValue = item.value.sup[item.value.sup_board]
		item.value.waterCircle = ['Без ватрушки', '1 ватрушка (500 руб.)', '2 ватрушки (1 000 руб.)']
		item.value.waterCircleValue = item.value.waterCircle[item.value.water_circle]

		return {
			item,
			changeTime,
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
