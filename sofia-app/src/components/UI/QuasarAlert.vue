<!--
	Окно ошибки
		title: заголовок окна*
		text: текст сообщения*
 -->
<template>
	<q-dialog persistent transition-show="scale" transition-hide="scale">
		<q-card class="bg-red text-white" style="width: 300px">
			<q-card-section>
				<div class="text-h6">{{ title }}</div>
			</q-card-section>

			<q-card-section class="q-pt-none">{{ text }}</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn flat label="OK" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			require: true
		},
		text: {
			type: String,
			require: true
		}
	},
}
</script>
