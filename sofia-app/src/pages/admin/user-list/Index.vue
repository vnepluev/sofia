<template>
	<!-- сообщение об ошибке -->
	<quasar-alert v-model="isError" title="Сервер вернул ошибку!" :text="errorMessage"></quasar-alert>
	<div class="q-pa-md">
		<div class="mb-4"></div>
		<q-table
			:rows="rows"
			:columns="columns"
			row-key="username"
			:selected-rows-label="getSelectedString"
			selection="multiple"
			v-model:selected="selected"
			:loading="isLoading"
			@request="onRequest"
		>
			<!-- кнопки -->
			<template v-slot:top>
				<br />
				<q-btn
					class="m-2"
					color="primary"
					:disable="isLoading || selected.length < 1"
					label="Block"
					@click="blockUser"
				/>
				<q-btn
					class="m-2"
					color="primary"
					:disable="isLoading || selected.length < 1"
					label="Unblock"
					@click="unBlockUser"
				/>
				<q-btn
					class="q-ml-sm"
					color="primary"
					:disable="isLoading || selected.length < 1"
					label="Delete"
					@click="removeUser"
				/>
				<q-space />
				<q-input borderless dense debounce="300" color="primary" v-model="filterTableData">
					<template v-slot:append>
						<q-icon name="search" />
					</template>
				</q-input>
			</template>

			<!-- индикатор загрузки -->
			<template v-slot:loading>
				<q-inner-loading
					showing
					color="primary"
					label="Загружаю данные..."
					label-style="font-size: 1.1em"
				/>
			</template>
		</q-table>
	</div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import QuasarAlert from 'src/components/UI/QuasarAlert.vue'

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
 */

export default {
	components: { QuasarAlert },

	setup() {
		const isLoading = ref(false)
		const isError = ref(false)
		const errorMessage = ref('')

		const $q = useQuasar()
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
			// const { filter } = props
			// console.log(filter, page, rowsPerPage, sortBy, descending);

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

		// фильтруем данные в таблице
		const filterTableData = ref()

		// selected.value - список выбранных пользователей
		const onlyUserName = () => {
			const users = []
			selected.value.forEach((user) => users.push(user.username))
			return users
		}

		/**
		 * Окно подтверждения
		 */
		const autoClose = () => {
			let seconds = 3;

			const dialog = $q.dialog({
				title: 'Информация успешно обновлена!',
				message: `До закрытия окна ${seconds} сек.`
			});

			const timer = setInterval(() => {
				seconds -= 1;
				if (seconds > 0) {
					dialog.update({
						message: `До закрытия окна ${seconds} сек.`
					});
				} else {
					clearInterval(timer);
					dialog.hide();
				}
			}, 1000);

			dialog.onOk(() => {
				seconds = 0;
			}).onDismiss(() => {
				clearTimeout(timer);
			})
		};

		/**
		 * заблокировать пользователей
		 */
		const blockUser = async () => {
			const userArr = onlyUserName()
			await api.put('/ban-users', userArr).then(() => {
				autoClose() // если все ок
			}).catch((err) => {
				// console.log(err.response.data)
				// console.log(err.response.status)
				// console.log(err.response.headers)
				errorMessage.value = `Возникла ошибка: ${err.response.status} ${err.response.data}`
				isError.value = true
			})
			selected.value.length = 0 // очищаем выбор
		}

		/**
		 * разблокировать пользователей
		 */
		const unBlockUser = async () => {
			const userArr = onlyUserName()
			await api.put('/unban-users', userArr).then(() => {
				autoClose() // если все ок
			}).catch((err) => {
				errorMessage.value = `Возникла ошибка: ${err.response.status} ${err.response.data}`
				isError.value = true
			})
			selected.value.length = 0 // очищаем выбор
		}

		/**
		 * удалить пользователей
		 */
		const removeUser = async () => {
			const userArr = onlyUserName()
			await api.put('/delete-users', userArr).then(() => {
				autoClose() // если все ок
			}).catch((err) => {
				// console.log(err.response.data)
				// console.log(err.response.status)
				// console.log(err.response.headers)
				errorMessage.value = `Возникла ошибка: ${err.response.status} ${err.response.data}`
				isError.value = true
			})
			selected.value.length = 0 // очищаем выбор
		}

		return {
			isLoading,
			isError,
			errorMessage,
			selected,
			columns,
			rows,

			getSelectedString() {
				return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.value.length}`
			},
			pagination,
			onRequest,
			blockUser,
			unBlockUser,
			removeUser,
			filterTableData
		}
	}
}
</script>
