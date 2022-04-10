<template>
	<h1>id</h1>
</template>

<script>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
	setup() {
		const $route = useRoute()
		const $store = useStore()

		let item = 0
		$store.getters['auth/getOrderList'].forEach((el) => {
			if (+el.id === +$route.params.id) item = el
			console.log(el.id, $route.params.id, 'item:', item)
		})
	}
}
</script>

<style lang="scss" scoped>
</style>
