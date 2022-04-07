<template>
	<div class="q-pa-md">
		<q-table
			grid
			title="Время выходов"
			:rows="rows"
			:columns="columns"
			row-key="name"
			:filter="filter"
			hide-header
			selection="multiple"
			v-model:selected="selected"
		>
			<!--  слоты-->
			<template v-slot:item="props">
				<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
					<q-card :class="props.selected ? 'bg-grey-2' : ''">
						<q-card-section>
							<q-checkbox dense v-model="props.selected" label="Завершено?" />
						</q-card-section>
						<q-card-section class="text-right">
							<strong>Яхта:</strong>
							{{ props.row.name }}
							<br />
							<strong>Начало:</strong>
							{{ props.row.name }}
							<br />
							<strong>Завершение:</strong>
							{{ props.row.name }}
						</q-card-section>
						<q-separator />
						<q-card-section class="flex flex-center">
							<div>Услуги (сапы / фотосессия / ватрушки)</div>
						</q-card-section>
						<q-separator />
						<q-card-section class="text-right">
							<strong>Пассажиров:</strong>
							{{ props.row.name }}
							<br />
							<strong>Промокод / сертификат:</strong>
							{{ props.row.name }}
							<br />
							<strong>Пожелание клиента:</strong>
							{{ props.row.name }}
						</q-card-section>
					</q-card>
				</div>
			</template>
			<!-- /слоты -->

			<!-- выбор даты -->
			<template v-slot:top-right>
				<q-input v-model="model">
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
import { ref } from 'vue'

const columns = [
	{
		name: 'desc',
		required: true,
		label: 'Dessert (100g serving)',
		align: 'left',
		field: (row) => row.name,
		format: (val) => `${val}`,
		sortable: true
	},
	{ name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
	{ name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
	{ name: 'carbs', label: 'Carbs (g)', field: 'carbs' }
]

const rows = [
	{
		name: 'Frozen Yogurt',
		calories: 159,
		fat: 6.0,
		carbs: 24
	},
	{
		name: 'Ice cream sandwich',
		calories: 237,
		fat: 9.0,
		carbs: 37
	},
	{
		name: 'Eclair',
		calories: 262,
		fat: 16.0,
		carbs: 23
	},
	{
		name: 'Cupcake',
		calories: 305,
		fat: 3.7,
		carbs: 67
	},
	{
		name: 'Gingerbread',
		calories: 356,
		fat: 16.0,
		carbs: 49
	},
	{
		name: 'Jelly bean',
		calories: 375,
		fat: 0.0,
		carbs: 94
	},
	{
		name: 'Lollipop',
		calories: 392,
		fat: 0.2,
		carbs: 98
	},
	{
		name: 'Honeycomb',
		calories: 408,
		fat: 3.2,
		carbs: 87
	},
	{
		name: 'Donut',
		calories: 452,
		fat: 25.0,
		carbs: 51
	},
	{
		name: 'KitKat',
		calories: 518,
		fat: 26.0,
		carbs: 65
	}
]

export default {
	setup() {
		return {
			selected: ref([]),
			filter: ref(''),
			columns,
			rows,
			model: ref({ from: '2022/04/10', to: '2022/04/11' })
		}
	}
}
</script>
