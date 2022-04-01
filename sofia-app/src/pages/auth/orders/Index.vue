<template>
	<q-page class="flex flex-center">
		<!-- таблица заказов -->
		<div class="q-pa-md w-full">
			<q-markup-table separator="vertical" flat bordered>
				<thead class="bg-teal glossy">
					<tr>
						<th colspan="4">
							<div class="row no-wrap items-center">
								<div class="text-h4 q-ml-md text-white">Мои заказы</div>
							</div>
						</th>
					</tr>
					<tr class="text-white">
						<th class="text-left text-white">Наименование</th>
						<th class="text-right">Начало</th>
						<th class="text-right">Завершение</th>
						<th class="text-right">Пассажиров</th>
					</tr>
				</thead>
				<tbody>
					<tr class="hover-item">
						<td class="text-left">Яхта "София"</td>
						<td class="text-right">10:00</td>
						<td class="text-right">12:00</td>
						<td class="text-right">4</td>
					</tr>
					<tr class="hover-item">
						<td class="text-left">Яхта "София"</td>
						<td class="text-right">14:00</td>
						<td class="text-right">15:30</td>
						<td class="text-right">3</td>
					</tr>
					<tr>
						<td class="text-left">Яхта "София"</td>
						<td class="text-right">17:30</td>
						<td class="text-right">19:30</td>
						<td class="text-right">2</td>
					</tr>
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
export default {

}
</script>

<style lang="scss" scoped>
.hover-item:hover {
	background-color: rgba($color: #000000, $alpha: 0.15);
}
</style>
