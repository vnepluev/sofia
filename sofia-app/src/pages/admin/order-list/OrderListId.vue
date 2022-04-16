<template>
	<!-- сообщение об ошибке -->
	<quasar-alert v-model="isError" title="Сервер вернул ошибку" :text="errorMessage" />

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
			<div class="q-gutter-md row items-start mt-1 text-gray-400">
				<div>{{ date.formatDate(item.date_start, 'HH:mm, YYYY/MM/DD') }}</div>
				<div class="pl-6-md">{{ date.formatDate(item.date_end, 'HH:mm, YYYY/MM/DD') }}</div>
			</div>
			<div class="q-gutter-md row items-start">
				<q-input v-model="item.date_start" type="datetime" hint="Начало прогулки" />
				<q-input v-model="item.date_end" type="datetime" hint="Завершение прогулки" />
				<q-btn outline :color="intervalColor" :icon="intervalIcon" title="Проверить интервал"
					:loading="isCheckIntervalLoading" @click.prevent="checkDataInterval" />
			</div>

			<!-- Если ошибка с датой -->
			<div class="q-gutter-md row items-start text-red-600 mt-4 ml-1" v-if="intervalErrorMessage.length > 0">
				{{ intervalErrorMessage }}
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
					<q-btn class="bg-teal text-white glossy" type="button" label="Подтвердить" @click.prevent="ok" />
					<q-btn class="bg-teal text-white glossy" type="button" label="Отменить" @click.prevent="cancel" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref } from 'vue'
import { api } from 'src/boot/axios'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'
import { date } from 'quasar'

export default {
	setup() {
		const $route = useRoute();
		const $router = useRouter();
		const $store = useStore();

		const isError = ref(false)
		const errorMessage = ref('');
		const order = $store.getters['auth/getOrderListId']($route.params.id);
		const item = ref();

		item.value = JSON.parse(JSON.stringify(order));

		// статус
		const statusList = ['В обработке', 'Забронирован', 'Завершен', 'Отклонен'];
		// яхта
		const yachtList = ['sofia'];

		// отмена редактирования
		const cancel = () => {
			$router.push('/admin/order-list/');
		};

		// обновляем данные на сервере
		const ok = () => {
			delete (item.value.user_id);
			const reqData = { ...item.value };

			errorMessage.value = ''
			api.put('/private-edit-order', reqData).then(() => $router.push('/admin/order-list/'))
				.catch((error) => {
					isError.value = true
					errorMessage.value = error.toString();
				});
		};

		/**
		 * проверяем, занято ли время
		 */
		const isCheckIntervalLoading = ref(false)
		const intervalErrorMessage = ref('')
		const intervalColor = ref('primary') // цвет кнопки 'проверка интервала'
		const intervalIcon = ref('autorenew') // иконка 'thumb_down_off_alt' - занято

		const checkDataInterval = async () => {
			isCheckIntervalLoading.value = true
			let entries
			try {
				entries = await api.post('/check-data-interval', {
					id: item.value.id,
					yacht_name: item.value.yacht_name,
					date_start: item.value.date_start,
					date_end: item.value.date_end
				})
			} catch (error) {
				intervalColor.value = 'red'
				intervalIcon.value = 'report_gmailerrorred'
				intervalErrorMessage.value = error.toString()
			} finally {
				isCheckIntervalLoading.value = false
			}

			// если интервал свободен
			if (entries?.status === 204) {
				intervalErrorMessage.value = ''
				intervalColor.value = 'secondary'
				intervalIcon.value = 'thumb_up_alt'
			}

			// если интервал занят
			if (entries?.data?.status === 'busy' || entries?.data?.length > 0) {
				intervalErrorMessage.value = ''
				intervalColor.value = 'red'
				intervalIcon.value = 'thumb_down_off_alt'
			}
		}

		return {
			isError,
			errorMessage,
			item,
			statusList,
			yachtList,
			ok,
			cancel,
			checkDataInterval,
			isCheckIntervalLoading,
			intervalColor,
			intervalIcon,
			intervalErrorMessage,
			date
		};
	},
	components: { QuasarAlert }
}
</script>

<style lang="scss" scoped>
</style>
