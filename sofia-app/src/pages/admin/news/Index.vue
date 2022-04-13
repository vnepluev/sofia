<template>
	<!-- Спрашиваем, действительно удалить? -->
	<quasar-confirm text="Удалить новость?" v-model="deleteNewsData.isDelete" @isOk="deleteNews" />

	<!-- Редактирование/ добавление новости -->
	<quasar-dialog
		v-model="isModalShow"
		:msgText="editNewsData"
		:msgType="isNewNews"
		@isChange="editNews"
		@isNew="addNews"
	/>

	<div class="q-pa-md q-gutter-sm text-center">
		<div class="q-px-lg q-pb-md">
			<q-timeline color="primary" v-if="errorMessage.length < 1">
				<div class="flex justify-end q-mb-lg q-mt-lg">
					<q-btn color="primary" @click="addNewsHandler" label="Добавить новость" />
				</div>
				<q-timeline-entry
					v-for="(item, index) in news"
					:key="item.id"
					:icon="(index % 2) ? 'tsunami' : undefined"
				>
					<!-- <template v-slot:title></template> -->
					<template v-slot:subtitle>
						<div class="flex justify-end">
							<q-btn
								outline
								color="primary"
								icon="edit"
								size="8px"
								:data-id="item.id"
								@click="editNewsHandler"
							/>
							<q-btn
								class="q-ml-xs"
								outline
								color="primary"
								icon="clear"
								size="8px"
								:data-id="item.id"
								@click="deleteHandler"
							/>
						</div>
						{{ item.attributes.title }}
					</template>

					<div v-html="compiledMarked(item.attributes.text)"></div>
				</q-timeline-entry>
			</q-timeline>
			<div v-else class="text-xl text-red font-bold">{{ errorMessage }}</div>
		</div>
	</div>
</template>

<script>
import QuasarConfirm from 'src/components/UI/QuasarConfirm.vue'
import QuasarDialog from 'src/components/UI/QuasarNewsDialog.vue'
import { api } from 'src/boot/axios'
import { onMounted, ref, reactive } from 'vue'
import { marked } from 'marked'

export default {
	components: { QuasarConfirm, QuasarDialog },
	setup() {
		const news = ref({})
		const errorMessage = ref('')
		const deleteNewsData = reactive({
			isDelete: false,
			newsId: null,
		})

		// получаем новости с сервера
		const getAllNews = () => api.get('/news?sort=id:desc').then((res) => res.data.data)

		onMounted(async () => {
			try {
				news.value = await getAllNews()
			} catch (error) {
				errorMessage.value = `Не удалось получить список новостей. Сервер вернул ошибку: ${error}`
			}
		})

		// преобразуем md разметку новости
		const compiledMarked = (text) => marked(text, { santize: true })

		// точно удаляем новость?
		const deleteHandler = (event) => {
			deleteNewsData.newsId = event.currentTarget.getAttribute('data-id')
			deleteNewsData.isDelete = true
		}

		// подтвердили удаление новости
		const deleteNews = async () => {
			try {
				await api.delete(`/news/${deleteNewsData.newsId}`).then(async () => {
					news.value = await getAllNews()
				})
			} catch (error) {
				errorMessage.value = `Ошибка при удалении данных: ${error} Обновите страницу`
			}
		}

		/**
		 * Диалог редактирования новости
		 */
		const isModalShow = ref(false)
		const editNewsData = reactive({
			newsId: null,
			title: '',
			text: '',
		})
		const isNewNews = ref(false) // тип popup окна

		// модальное окно для редактирования
		const editNewsHandler = (event) => {
			isModalShow.value = true
			editNewsData.newsId = event.currentTarget.getAttribute('data-id')
			const findNews = news.value.find((el) => +el.id === +editNewsData.newsId)
			editNewsData.title = findNews.attributes.title
			editNewsData.text = findNews.attributes.text
		}

		// редактируем новость на сервере
		const editNews = async () => {
			try {
				const data = {
					data: {
						title: editNewsData.title.trim(),
						text: editNewsData.text.trim(),
					}
				}
				await api.put(`/news/${editNewsData.newsId}`, data).then(async () => {
					news.value = await getAllNews()
				})
			} catch (error) {
				errorMessage.value = `Ошибка при изменении данных: ${error} Обновите страницу`
			}
		}

		/**
		 * Добавить новость
		 */
		const addNewsHandler = () => {
			isNewNews.value = true // новая новость
			editNewsData.title = ''
			editNewsData.text = ''
			isModalShow.value = true
		}

		// отправляем новость на сервер
		const addNews = async () => {
			try {
				await api.post('/news', {
					data: {
						title: editNewsData.title.trim(),
						text: editNewsData.text.trim(),
					}
				})
				news.value = await getAllNews();
			} catch (error) {
				errorMessage.value = `Ошибка при добавлении новости: ${error} Обновите страницу`
			}
		}

		return {
			news,
			compiledMarked,
			errorMessage,
			deleteHandler,
			deleteNews,
			deleteNewsData,
			editNewsHandler,
			isModalShow,
			editNewsData,
			editNews,
			isNewNews,
			addNewsHandler,
			addNews
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
