<template>
	<div class="q-pa-md">
		<q-table
			title="Список пользователей"
			:rows="rows"
			:columns="columns"
			row-key="username"
			:selected-rows-label="getSelectedString"
			selection="multiple"
			v-model:selected="selected"
			:loading="isLoading"
			@request="onRequest"
		>
			<template v-slot:loading>
				<q-inner-loading
					showing
					color="primary"
					label="Загружаю данные..."
					label-style="font-size: 1.1em"
				/>
			</template>
		</q-table>

		<div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const columns = [
	{ name: 'username', label: 'phone', field: 'username', sortable: true },
	{ name: 'phone2', align: 'center', label: 'phone 2', field: 'phone2', sortable: true },
	{ name: 'fio', label: 'fio', field: 'fio', sortable: true },
	{ name: 'blocked', label: 'blocked', field: 'blocked', sortable: true },
	{ name: 'telegram_nickname', label: 'telegram_nickname', field: 'telegram_nickname' },
	{ name: 'group', label: 'group', field: 'group', sortable: true },
	{ name: 'createdAt', label: 'createdAt', field: 'createdAt', sortable: true },
]

/**
 * настроить пагинацию
 * <q-table
		title="Treats"
		:rows="rows"
		:columns="columns"
		row-key="name"
		:pagination="initialPagination"
	 />
 *      initialPagination: {
		  sortBy: 'desc',
		  descending: false,
		  page: 2,
		  rowsPerPage: 3
		  // rowsNumber: xx if getting data from a server
		},

		// добавить 2 кнопки сверху
		<template v-slot:top>
		  <q-btn color="primary" :disable="loading" label="Add row" @click="addRow" />
		  <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" @click="removeRow" />
		  <q-space />
		  <q-input borderless dense debounce="300" color="primary" v-model="filter">
			 <template v-slot:append>
				<q-icon name="search" />
			 </template>
		  </q-input>
		</template>
 */

export default {
	setup() {
		const isLoading = ref(false)
		const selected = ref([])
		const pagination = ref({
			sortBy: 'desc',
			descending: false,
			page: 1,
			rowsPerPage: 3,
			rowsNumber: 10
		})

		// запрашиваем данные с сервера
		const rows = ref([])

		const onRequest = async (props) => {
			const { page, rowsPerPage, sortBy, descending } = props.pagination
			const { filter } = props
			console.log(filter, page, rowsPerPage, sortBy, descending);

			isLoading.value = true

			await api.get('/user-list').then((res) => {
				pagination.value.rowsNumber = res.data.shift().total_entries // общее кол-во записей

				// fetch data from "server"
				res.data.forEach((element) => {
					const date = new Date(element.createdAt).toLocaleString('ru')
					element.createdAt = date
				});
				rows.value = res.data

				// don't forget to update local pagination object
				pagination.value.page = page
				pagination.value.rowsPerPage = rowsPerPage
				pagination.value.sortBy = sortBy
				pagination.value.descending = descending
			})

			isLoading.value = false
		}

		// инициализируем данные
		onMounted(() => {
			// get initial data from server (1st page)
			onRequest({
				pagination: pagination.value,
				filter: undefined
			})
		})

		return {
			isLoading,
			selected,
			columns,
			rows,

			getSelectedString() {
				return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.value.length}`
			},
			pagination,
			onRequest
		}
	}
}
</script>
