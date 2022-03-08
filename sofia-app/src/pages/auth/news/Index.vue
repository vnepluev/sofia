<template>
	<div class="q-pa-md q-gutter-sm text-center">
		<q-banner rounded class="bg-purple-8 text-white">Добро пожаловать, {{ getMe.fio }}!</q-banner>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'PageNews',

	computed: {
		...mapGetters('auth', ['getMe'])
	},

	setup() {
	}
}
</script>

<style lang="scss" scoped>
</style>
