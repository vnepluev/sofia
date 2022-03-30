<template>
	<quasar-spinner v-if="isLoading" />
	<div v-else>
		<div class="q-pa-md q-gutter-sm text-center">
			<q-banner
				rounded
				class="bg-purple-8 text-white"
			>Добро пожаловать{{ getFio.length > 0 ? `, ${getFio}` : '' }}!</q-banner>
		</div>

		<div class="q-pa-md q-gutter-sm text-center">
			<div class="q-px-lg q-pb-md">
				<q-timeline v-if="errorMessage.length < 1" color="primary">
					<q-timeline-entry
						v-for="(item, index) in news"
						:key="item.id"
						:icon="(index % 2) ? 'tsunami' : undefined"
					>
						<template v-slot:subtitle>{{ item.attributes.title }}</template>

						<div v-html="compiledMarked(item.attributes.text)"></div>
					</q-timeline-entry>
				</q-timeline>
				<div v-else class="text-xl text-red font-bold">{{ errorMessage }}</div>
			</div>
		</div>
	</div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api } from 'src/boot/axios'
import { marked } from 'marked'
import QuasarSpinner from 'src/components/UI/QuasarSpinner.vue'

export default {
	name: 'PageNews',
	setup() {
		const isLoading = ref(true)
		const $store = useStore();
		const getFio = computed(() => $store.getters['auth/getMe'].fio);
		const news = ref({});
		const errorMessage = ref('');
		// получаем новости с сервера
		const getAllNews = () => api.get('/news?sort=id:desc').then((res) => res.data.data);
		// преобразуем md разметку новости
		const compiledMarked = (text) => marked(text, { santize: true });
		onMounted(async () => {
			try {
				news.value = await getAllNews();
				isLoading.value = false
			} catch (error) {
				isLoading.value = false
				errorMessage.value = `Не удалось получить список новостей. Сервер вернул ошибку: ${error}`;
			}
		});
		return { isLoading, getFio, compiledMarked, errorMessage, news };
	},
	components: { QuasarSpinner }
}
</script>

<style lang="scss" scoped>
</style>
