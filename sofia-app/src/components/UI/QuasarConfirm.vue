<!--
	Окно вопроса (да/нет)
		text: текст сообщения*
 -->
<template>
	<q-dialog persistent transition-show="scale" transition-hide="scale">
		<q-card class="bg-red text-white" style="width: 300px">
			<q-card-section class="text-h6">{{ text }}</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn flat label="Подтвердить" v-close-popup @click="okHandler" />
				<q-btn flat label="Отменить" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
export default {
	props: {
		text: {
			type: String,
			require: true
		}
	},
	setup(props, { emit }) {
		const okHandler = () => emit('isOk')

		return { okHandler }
	}
}
</script>
