<!--
	преобразование даты в локальный формат
	http://old.code.mu/javascript/date/toLocaleString.html

	q-btn - анимация загрузки
	<template v-slot:loading>
      <q-spinner-facebook />
    </template>
-->
<template>
	<q-page class="flex flex-center">
		<!-- Индикатор загрузки -->
		<quasar-spinner v-if="isLoading" />

		<!-- Сообщение об ошибке -->
		<div v-if="errorMessage.length > 0" class="q-pa-md q-gutter-sm text-center text-xl text-red font-bold">{{
			errorMessage
		}}</div>

		<!-- Информация об оплате -->
		<div v-if="!isLoading && errorMessage.length < 1 && isShowInfoMessage && !isComponentEditOrder"
			class="inline bg-yellow-100 rounded-borders mt-4" style="max-width: 760px">
			<div class="flex flex-center text-center q-pa-md font-medium">
				После создания заказа, переведите 990 руб. на банковскую карту, по номеру телефона:&nbsp;<a
					href="tel:+79050224000" class="text-primary">+79050224000</a>&nbsp;<i>(Валерий
					Владимирович Н.)</i>
				<br>
				В комментарии к переводу укажите ваш логин на сайте, например: 9050224000&nbsp;<i>(больше ничего указывать
					не нужно).</i>
				<br>
				Одобрение заявок проходит в ручном режиме (от 5 до 60 минут в рабочее время). Приезжайте за 10-15 минут
				до начала прогулки. Если опаздываете, пожалуйста, предупредите нас заранее.
				<br>
				<br>
				Активация сертификата проходит без предоплаты!
				<a href="#" @click.prevent="isShowInfoMessage = false" class="text-primary">Скрыть</a>
			</div>
		</div>

		<div v-if="!isComponentEditOrder" class="flex flex-center">
			<!-- таблица заказов -->
			<div class="q-pa-md w-full">
				<q-markup-table v-if="!isLoading && errorMessage.length < 1" separator="vertical" flat bordered>
					<thead class="bg-teal glossy">
						<tr>
							<th colspan="6">
								<div class="row no-wrap items-center">
									<div class="text-h6 q-ml-md text-white">Мои заказы</div>
								</div>
							</th>
						</tr>
						<tr class="text-white">
							<th></th>
							<th class="text-left text-white">Наименование</th>
							<th class="text-right">Начало</th>
							<th class="text-right">Статус</th>
							<th class="text-right">Завершение</th>
							<th class="text-right">Пассажиров</th>
						</tr>
					</thead>
					<tbody>
						<tr class="hover-item" v-for="orders in myOrders" :key="orders.id">
							<td @click="editOrder" :data-id="orders.id">
								<q-btn flat round color="primary" title="Уточнить заказ" icon="drive_file_rename_outline" />
							</td>
							<td class="text-left">{{ orders.yacht_name === 'sofia' ? 'Яхта "София"' : '' }}</td>
							<td class="text-right">{{ orders.date_start }}</td>
							<td class="text-right">{{ orders.order_status }}</td>
							<td class="text-right">{{ orders.date_end }}</td>
							<td class="text-right">{{ orders.people_count }}</td>
						</tr>
						<th colspan="5" v-if="myOrders.length < 1">
							<div class="row no-wrap items-center">
								<div class="text-sm q-ml-md">Создайте свой первый заказ</div>
							</div>
						</th>
					</tbody>
				</q-markup-table>
			</div>
			<!-- /таблица заказов -->

			<!-- кнопки добавить новый заказ -->
			<div class="q-pa-md q-gutter-sm">
				<q-btn color="primary" to="/auth/orders/add" label="Новый заказ" />
				<q-btn color="primary" to="/auth/orders/add/cert" label="Активация сертификата" />
			</div>
			<!-- /кнопки добавить новый заказ -->
		</div>

		<!-- Редактируем заказ -->
		<app-edit-order v-if="isComponentEditOrder" :data="currentOrderItem" @close="isComponentEditOrder = false" />
	</q-page>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import QuasarSpinner from 'src/components/UI/QuasarSpinner.vue'
import { api } from 'src/boot/axios'
import AppEditOrder from './AppEditOrder.vue'

export default {
	setup() {
		const isLoading = ref(true)
		const errorMessage = ref('')
		const myOrders = ref([])

		const isComponentEditOrder = ref(false) // подключаем компонент редактирования заказа
		const currentOrderItem = ref() // текущий редактируемый объект

		// получаем мои заказы с сервера
		const getMyOrders = () => api.get('/my-orders')
			.then((res) => {
				isLoading.value = false
				// long - словами; numeric - числом
				res.data.forEach((order) => {
					let d = new Date(order.date_start)
					order.date_start = d.toLocaleString('ru', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
						timezone: 'UTC',
						hour: 'numeric',
						minute: 'numeric',
					})
					d = new Date(order.date_end)
					order.date_end = d.toLocaleString('ru', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
						timezone: 'UTC',
						hour: 'numeric',
						minute: 'numeric',
					})
				});
				return res.data
			})
			.catch((error) => {
				errorMessage.value = `Не удалось получить расписание. Сервер вернул ошибку: ${error}`
				isLoading.value = false
			})

		onBeforeMount(async () => {
			myOrders.value = await getMyOrders()
		})

		/**
		 * редактируем заказ
		 */
		const editOrder = (e) => {
			isComponentEditOrder.value = true
			const id = +e.currentTarget.getAttribute('data-id')
			currentOrderItem.value = myOrders.value.find((el) => id === el.id)
		}

		return {
			isLoading,
			errorMessage,
			myOrders,
			editOrder,
			isShowInfoMessage: ref(true),
			currentOrderItem,
			isComponentEditOrder
		}
	},
	components: { QuasarSpinner, AppEditOrder }
}
</script>

<style lang="scss" scoped>
.hover-item:hover {
	background-color: rgba($color: #000000, $alpha: 0.15);
}
</style>
