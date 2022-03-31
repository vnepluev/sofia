<!--
	Окно вопроса (да/нет)
		text: текст сообщения*
		type: цвет фона (bg-teal)
	Возвращает:
		isOk (true / false)
 -->
<template>
	<q-dialog persistent transition-show="scale" transition-hide="scale">
		<q-card class="text-white" :class="type" style="width: 300px">
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
		},
		type: {
			type: String,
			require: false,
			default: 'bg-red' // по умолчанию цвет фона красный
		}
	},
	setup(props, { emit }) {
		const okHandler = () => emit('isOk')

		return { okHandler }
	}
}
</script>
