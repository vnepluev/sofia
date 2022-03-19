<template>
	<!-- Спрашиваем, действительно удалить? -->
	<quasar-confirm text="Удалить новость?" v-model="deleteNewsData.isDelete" @isOk="deleteNews" />

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
							<q-btn outline color="primary" icon="edit" size="8px" :data-id="item.id" />
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
			newsId: null
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

		return { news, compiledMarked, errorMessage, deleteHandler, deleteNews, deleteNewsData }
	}
}
</script>

<style lang="scss" scoped>
</style>
