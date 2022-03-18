<template>
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
							<q-btn class="q-ml-xs" outline color="primary" icon="clear" size="8px" />
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
import { onBeforeMount, ref, reactive } from 'vue'
import { api } from 'src/boot/axios'
import { marked } from 'marked'

export default {
	setup() {
		const news = reactive({})
		const errorMessage = ref('')

		onBeforeMount(() => {
			try {
				api.get('/news?sort=id:desc').then((res) => Object.assign(news, res.data.data))
			} catch (error) {
				errorMessage.value = `Не удалось получить список новостей. Сервер вернул ошибку: ${error}`
			}
		})

		const compiledMarked = (text) => marked(text, { santize: true })

		return { news, compiledMarked, errorMessage }
	}
}
</script>

<style lang="scss" scoped>
</style>
