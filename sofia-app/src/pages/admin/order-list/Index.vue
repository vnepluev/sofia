<template>
	<div class="q-pa-md">
		<div v-if="errorMessage !== ''" class="text-xl text-red font-bold">{{ errorMessage }}</div>

		<q-table grid title="Время выходов" :rows="rows" row-key="id" :filter="filter" hide-header>
			<!--  слоты-->
			<template v-slot:item="props">
				<div class="q-pa-xs col-xs-12 col-sm-6 col-lg-4">
					<q-card>
						<q-card-section class="text-right">
							<div class="flex justify-start">
								<q-btn outline color="primary" icon="edit" size="8px"
									:to="`/admin/order-list/${props.row.id}`" />
							</div>
							<strong>Яхта:</strong>
							{{ props.row.yacht_name }} [{{ props.row.people_count }}]
							<br />
							<strong>Статус:&nbsp;</strong>
							<span class="text-teal font-bold">{{ props.row.order_status || 'Не определен' }}</span>
							<br />
							<br />
							<strong>Начало:</strong>
							{{ date.formatDate(props.row.date_start, 'HH:mm, YYYY/MM/DD') }}
							<br />
							<strong>Завершение:</strong>
							{{ date.formatDate(props.row.date_end, 'HH:mm, YYYY/MM/DD') }}
						</q-card-section>
						<q-separator />
						<q-card-section class="text-right">
							<strong>Контакт:&nbsp;</strong>
							<a :href="`tel:+7${props.row.user_id.username}`" class="text-primary" target="_blank">{{
								props.row.user_id.username
							}}</a>
							- {{ props.row.user_id.fio }}
							<br />
							<div v-if="props.row.user_id.phone2">
								<strong>Контакт:&nbsp;</strong>
								<a :href="`tel:+7${props.row.user_id.phone2}`" class="text-primary" target="_blank">{{
									props.row.user_id.phone2
								}}</a>
							</div>
							<div v-if="props.row.user_id.telegram_nickname">
								<strong>Telegram:&nbsp;</strong>
								<a :href="`https://${props.row.user_id.telegram_nickname}`" target="_blank"
									class="text-primary">{{ props.row.user_id.telegram_nickname }}</a>
							</div>
						</q-card-section>
						<q-separator v-if="props.row.photo || props.row.water_circle || props.row.sup_board" />
						<q-card-section class="flex flex-center flex-col"
							v-if="props.row.photo || props.row.water_circle || props.row.sup_board">
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
						<q-separator v-if="props.row.promocode || props.row.sert_number" />
						<q-card-section class="text-right" v-if="props.row.promocode || props.row.sert_number">
							<div v-if="props.row.promocode">
								<strong>Промокод:&nbsp;</strong>
								{{ props.row.promocode }}
								<br />
							</div>
							<div v-if="props.row.sert_number">
								<strong>Сертификат №:&nbsp;</strong>
								{{ props.row.sert_number }}<br />
								{{ props.row.sert_activated ? '[активирован]' : '[не активирован]' }}
								<br />
							</div>
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
				<q-toggle keep-color v-model="needAnswer" label="Заявки" />
			</template>
			<!-- /выбор даты -->
		</q-table>
	</div>
</template>

<script>
import { computed } from '@vue/reactivity'
import { onBeforeMount, ref, watch } from 'vue'
import { date } from 'quasar'
import { useStore } from 'vuex'

export default {
	setup() {
		const $store = useStore()
		const errorMessage = ref('')
		const needAnswer = ref(false)

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
		 * - isAnswer - запрос всех заявок со статусом 'В обработке'
		 */
		const getOrders = async (dateStart, dateEnd, isAnswer = false) => {
			const res = await $store.dispatch('auth/getOrderList', {
				dateStart,
				dateEnd,
				answer: isAnswer
			})
			if (res !== false) errorMessage.value = res // если возникла ошибка
			return $store.getters['auth/getOrderList']
		}

		onBeforeMount(async () => {
			const currentDate = new Date().toISOString().split('T')[0]
			rows.value = await getOrders(currentDate, currentDate)
		})

		/**
		 * При выборе новой даты запрашиваем данные с сервера
		 */
		watch(calcDate, async (newValue) => {
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
			rows.value = await getOrders(dateStart, dateEnd)
			needAnswer.value = false
		})

		/**
		 * При смене переключателя подтягиваем новые заявки с сервера
		 */
		watch(needAnswer, async (newValue, oldValue) => {
			if (newValue) {
				// дата начала / завершения нам не интересны
				// когда запрашиваем новые заявки
				rows.value = await getOrders(false, false, newValue)
			} else if (oldValue === true) {
				const currentDate = new Date().toISOString().split('T')[0]
				rows.value = await getOrders(currentDate, currentDate)
				model.value = currentDate
			}
		})

		return {
			errorMessage,
			selected: ref([]),
			filter: ref(''),
			rows,
			model,
			calcDate,
			date,
			needAnswer
		}
	}
}
</script>
