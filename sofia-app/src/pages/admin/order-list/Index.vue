<template>
	<div class="q-pa-md">
		<q-table grid title="Время выходов" :rows="rows" row-key="id" :filter="filter" hide-header>
			<!--  слоты-->
			<template v-slot:item="props">
				<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
					<q-card>
						<q-card-section class="text-right">
							<div class="flex justify-start">
								<q-btn
									outline
									color="primary"
									icon="edit"
									size="8px"
									:data-id="props.row.id"
									@click="editOrderHandler"
								/>
							</div>
							<strong>Яхта:</strong>
							{{ props.row.yacht_name }} [{{ props.row.people_count }}]
							<br />
							<strong>Начало:</strong>
							{{ date.formatDate(props.row.date_start, 'HH:mm, YYYY/MM/DD') }}
							<br />
							<strong>Завершение:</strong>
							{{ date.formatDate(props.row.date_end, 'HH:mm, YYYY/MM/DD') }}
						</q-card-section>
						<q-separator />
						<q-card-section class="text-right">
							<strong>Контакт:</strong>
							{{ props.row.user_id.username }} - {{ props.row.user_id.fio }}
							<br />
							<div v-if="props.row.user_id.phone2">
								<strong>Контакт:</strong>
								{{ props.row.user_id.phone2 }}
							</div>
						</q-card-section>
						<q-separator />
						<q-card-section class="flex flex-center flex-col">
							<div v-if="props.row.photo">
								<strong style="color: green;">Фотосессия:</strong>
								{{ props.row.photo }}
							</div>
							<div v-if="props.row.water_circle">
								<strong>Ватрушка:</strong>
								{{ props.row.water_circle }}
							</div>
							<div v-if="props.row.sup_board">
								<strong>Sup Board:</strong>
								{{ props.row.sup_board }}
							</div>
						</q-card-section>
						<q-separator />
						<q-card-section class="text-right">
							<strong>Промокод / сертификат:</strong>
							{{ props.row.id }}
							<br />
							<div v-if="props.row.comment">
								<strong>Пожелание клиента:</strong>&nbsp;
								<i>{{ props.row.comment }}</i>
							</div>
						</q-card-section>
					</q-card>
				</div>
			</template>
			<!-- /слоты -->

			<!-- выбор даты -->
			<template v-slot:top-right>
				<q-input v-model="calcDate">
					<template v-slot:append>
						<q-icon name="event" class="cursor-pointer">
							<q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
								<q-date v-model="model" range>
									<div class="row items-center justify-end">
										<q-btn v-close-popup label="Закрыть" color="primary" flat />
									</div>
								</q-date>
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>
			</template>
			<!-- /выбор даты -->
		</q-table>
	</div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { api } from 'src/boot/axios'
import { onBeforeMount, ref, watch } from 'vue'
import { date } from 'quasar'

export default {
	setup() {
		// получаем диапазон текущей даты
		const newDate = new Date().toLocaleString('en-US', {
			year: 'numeric', month: '2-digit', day: '2-digit'
		}).split('/').reverse()
		const [year, day, month] = newDate
		const dateModel = `${year}/${month}/${day}`

		const model = ref(dateModel)
		const rows = ref([]) // массив заказов

		/**
		 * Форматирование даты в поле ввода
		 */
		const calcDate = computed(() => {
			let result = model.value

			if (model.value?.to !== undefined) {
				result = `${model.value.from} - ${model.value.to}`
			}
			return result
		})

		/**
		 * Получаем список заказов с сервера
		 *
		 * - дата начала
		 * - дата завершения
		 */
		const getOrders = (dateStart, dateEnd) => api.post('/private-order-list', {
			date_start: dateStart,
			date_end: dateEnd
		})

		onBeforeMount(() => {
			const currentDate = new Date().toISOString().split('T')[0]
			getOrders(currentDate, currentDate).then((res) => {
				rows.value = res.data
			})
		})

		/**
		 * При выборе новой даты запрашиваем данные с сервера
		 */
		watch(calcDate, (newValue) => {
			if (newValue === null) return

			let dateStart = ''
			let dateEnd = ''

			if (model.value?.to === undefined) {
				// даты совпадают
				dateStart = model.value
				dateEnd = model.value
			} else {
				dateStart = model.value.from
				dateEnd = model.value.to
			}
			getOrders(dateStart, dateEnd).then((res) => {
				rows.value = res.data
			})
		})

		/**
		 * редактируем заказ
		 */
		const editOrderHandler = () => {

		}

		return {
			selected: ref([]),
			filter: ref(''),
			rows,
			model,
			calcDate,
			editOrderHandler,
			date
		}
	}
}
</script>
