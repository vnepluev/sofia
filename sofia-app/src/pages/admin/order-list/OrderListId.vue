<template>
	<div class="q-pa-md">
		<h2 class="text-xl text-center">Редактирование заказа №{{ item.id }}</h2>
	</div>
	<div class="q-pa-md q-gutter-sm text-center">
		<div class="q-px-lg q-pb-md">
			<div class="q-gutter-md row items-start">
				<!-- Яхта -->
				<q-select filled v-model="item.yacht_name" :options="yachtList" label="Яхта" />
				<!-- Статус заказа -->
				<q-select filled v-model="item.order_status" :options="statusList" label="Статус заказа" />
			</div>

			<!-- Время старта -->
			<div class="q-gutter-md row items-start">
				<q-input v-model="item.date_start" type="datetime" hint="Начало прогулки" />
				<q-input v-model="item.date_end" type="datetime" hint="Завершение прогулки" />
			</div>

			<!-- Оплата -->
			<div class="q-gutter-md row items-start mt-4">
				<q-input v-model="item.pay" filled type="number" hint="Оплачено клиентом" />
			</div>
			<div class="q-gutter-md row items-start">
				<q-checkbox name="order-done" v-model="item.pay_done" label="Заказ полностью оплачен?" />
			</div>

			<!-- Промокод -->
			<div class="q-gutter-md row items-start">
				<q-input v-model="item.promocode" type="text" hint="Промокод" />
				<q-input v-model.number="item.people_count" type="number" min="1" max="12" hint="Кол-во человек"
					color="primary" />
			</div>

			<!-- Пожелание клиента -->
			<div class="q-gutter-md row items-start">
				<q-input v-model="item.comment" autogrow class="w-6/12" hint="Пожелание клиента" />
			</div>

			<!-- Услуги -->
			<div class="q-gutter-md row items-start">
				<q-input v-model.number="item.photo" type="number" min="0" max="12" hint="Фотосессия" />
				<q-input v-model.number="item.water_circle" type="number" min="0" max="2" hint="Ватрушки" />
				<q-input v-model.number="item.sup_board" type="number" min="0" max="2" hint="Sup Board" />
				<q-input v-model.number="item.date_skip" filled type="number" min="0" max="2" hint="Перенос даты" />
			</div>

			<!-- Активация сертификата -->
			<h4 class="text-lg mt-10">Активация сертификата</h4>
			<div class="q-gutter-md row items-start">
				<q-input v-model="item.sert_number" type="text" hint="№ сертификата" />
				<q-input v-model="item.sert_booking_code" type="number" hint="код бронирования" />
				<q-input v-model="item.sert_done_code" type="number" hint="код подтверждения" />
			</div>
			<div class="q-gutter-md row items-start">
				<q-checkbox name="activate-cert" v-model="item.sert_activated" label="Сертификат погашен?" />
			</div>

			<!-- Кнопки подтверждения -->
			<div class="mt-6">
				<div class="q-gutter-md flex justify-center min-w-min max-w-lg">
					<q-btn class="bg-teal text-white glossy" type="submit" label="Подтвердить" @click="step = 2" />
					<q-btn class="bg-teal text-white glossy" type="submit" label="Отменить" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ref } from 'vue'

export default {
	setup() {
		const $route = useRoute()
		const $store = useStore()

		const order = $store.getters['auth/getOrderListId']($route.params.id)
		const item = ref()
		item.value = JSON.parse(JSON.stringify(order))

		// статус
		const statusList = ['В обработке', 'Забронирован', 'Активирован', 'Одобрен', 'Завершен', 'Отклонен']

		// яхта
		const yachtList = ['sofia']

		return {
			item,
			statusList,
			yachtList,
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
