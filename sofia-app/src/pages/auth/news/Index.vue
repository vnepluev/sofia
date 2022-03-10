<template>
	<div class="q-pa-md q-gutter-sm text-center">
		<q-banner rounded class="bg-purple-8 text-white">Добро пожаловать, {{ getFio }}!</q-banner>
	</div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
	name: 'PageNews',

	setup() {
		const $store = useStore()
		const getFio = computed(() => $store.getters['auth/getMe'].fio)

		return { getFio }
	}
}
</script>

<style lang="scss" scoped>
</style>
