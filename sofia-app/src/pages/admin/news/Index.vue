<template>
	<div class="q-pa-md q-gutter-sm text-center">
		<div class="q-px-lg q-pb-md">
			<q-timeline color="primary">
				<br />
				<q-timeline-entry
					v-for="(item, index) in news"
					:key="item.id"
					:icon="(index % 2) ? 'tsunami' : undefined"
				>
					<!-- <template v-slot:title></template> -->
					<template v-slot:subtitle>{{ item.attributes.title }}</template>

					<div v-html="compiledMarked(item.attributes.text)"></div>
				</q-timeline-entry>
				{{ news }}
			</q-timeline>
		</div>
	</div>
</template>

<script>
import { onBeforeMount, reactive } from 'vue'
import { api } from 'src/boot/axios'
import { marked } from 'marked'

export default {
	setup() {
		const news = reactive({})

		onBeforeMount(() => {
			try {
				api.get('/news').then((res) => Object.assign(news, res.data.data))
			} catch (error) {
				console.log(error)
			}
		})

		const compiledMarked = (text) => marked(text, { santize: true })

		return { news, compiledMarked }
	}
}
</script>

<style lang="scss" scoped>
</style>
