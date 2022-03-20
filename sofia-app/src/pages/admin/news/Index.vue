<template>
	<!-- Спрашиваем, действительно удалить? -->
	<quasar-confirm text="Удалить новость?" v-model="deleteNewsData.isDelete" @isOk="deleteNews" />

	<!-- Редактирование новости -->
	<q-dialog v-model="isModalShow" persistent>
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6 text-primary">Заголовок новости</div>
				<q-input dense v-model="editNewsData.title" autofocus v-close-popup @keyup.enter="editNews" />
			</q-card-section>

			<q-card-section class="q-pt-none">
				<div class="text-h6 text-primary">Текст</div>
				<q-input dense v-model="editNewsData.text" type="textarea" />
			</q-card-section>

			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Отмена" v-close-popup />
				<q-btn flat label="Редактировать" v-close-popup @click="editNews" />
			</q-card-actions>
		</q-card>
	</q-dialog>

	<div class="q-pa-md q-gutter-sm text-center">
		<div class="q-px-lg q-pb-md">
			<q-timeline color="primary" v-if="errorMessage.length < 1">
				<div class="flex justify-end q-mb-lg q-mt-lg">
					<q-btn color="primary" label="Добавить новость" />
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
import { api } from 'src/boot/axios'
import { onMounted, ref, reactive } from 'vue'
import { marked } from 'marked'

export default {
	components: { QuasarConfirm },
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
			text: ''
		})

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
			editNews
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
