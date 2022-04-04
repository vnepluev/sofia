<!--
	преобразование даты в локальный формат
	http://old.code.mu/javascript/date/toLocaleString.html
-->
<template>
	<q-page class="flex flex-center">
		<!-- Индикатор загрузки -->
		<quasar-spinner v-if="isLoading" />

		<!-- Сообщение об ошибке -->
		<div
			v-if="errorMessage.length > 0"
			class="q-pa-md q-gutter-sm text-center text-xl text-red font-bold"
		>{{ errorMessage }}</div>

		<!-- таблица заказов -->
		<div class="q-pa-md w-full">
			<q-markup-table v-if="!isLoading && errorMessage.length < 1" separator="vertical" flat bordered>
				<thead class="bg-teal glossy">
					<tr>
						<th colspan="5">
							<div class="row no-wrap items-center">
								<div class="text-h5 q-ml-md text-white">Мои заказы</div>
							</div>
						</th>
					</tr>
					<tr class="text-white">
						<th class="text-left text-white">Наименование</th>
						<th class="text-right">Начало</th>
						<th class="text-right">Завершение</th>
						<th class="text-right">Пассажиров</th>
						<th class="text-right">Статус</th>
					</tr>
				</thead>
				<tbody>
					<tr class="hover-item" v-for="orders in myOrders" :key="orders.id">
						<td class="text-left">{{ orders.yacht_name === 'sofia' ? 'Яхта "София"' : '' }}</td>
						<td class="text-right">{{ orders.date_start }}</td>
						<td class="text-right">{{ orders.date_end }}</td>
						<td class="text-right">{{ orders.people_count }}</td>
						<td class="text-right">В обработке</td>
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
			<q-btn color="primary" label="Активация сертификата" />
		</div>
		<!-- /кнопки добавить новый заказ -->

		<!-- добавить новый заказ -->
		<!-- <div class="q-pa-md block">
			<q-btn class="glossy m-4" round color="primary" icon="add_circle_outline">
				<q-menu
					transition-show="scale"
					transition-hide="scale"
					anchor="center middle"
					self="center middle"
					:offset="[0, 10]"
				>
					<q-list style="min-width: 100px">
						<q-item clickable v-close-popup class="hover-item" to="/auth/orders/add">
							<q-item-section>Новый заказ</q-item-section>
						</q-item>
						<q-item clickable v-close-popup class="hover-item">
							<q-item-section>Активация сертификата</q-item-section>
						</q-item>
					</q-list>
				</q-menu>
			</q-btn>
		</div>-->
		<!-- /добавить новый заказ -->
	</q-page>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import QuasarSpinner from 'src/components/UI/QuasarSpinner.vue'
import { api } from 'src/boot/axios'

export default {
	setup() {
		const isLoading = ref(true)
		const errorMessage = ref('')
		const myOrders = ref([])

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

		return { isLoading, errorMessage, myOrders }
	},
	components: { QuasarSpinner }
}
</script>

<style lang="scss" scoped>
.hover-item:hover {
	background-color: rgba($color: #000000, $alpha: 0.15);
}
</style>
