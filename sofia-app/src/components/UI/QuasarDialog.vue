<!--
	Редактирование / добавление новости
	msgType: Boolean - новая ли новость
	msgText:
		- title
		- text
 -->
<template>
	<q-dialog persistent>
		<q-card style="min-width: 350px">
			<q-card-section>
				<div class="text-h6 text-primary">Заголовок новости</div>
				<q-input dense v-model="newsData.title" autofocus @keyup.enter="editNews" />
			</q-card-section>

			<q-card-section class="q-pt-none">
				<div class="text-h6 text-primary">Текст</div>
				<q-input dense v-model="newsData.text" type="textarea" />
			</q-card-section>

			<q-card-actions align="right" class="text-primary">
				<q-btn flat label="Отмена" v-close-popup />
				<q-btn
					flat
					:label="msgType === true ? 'Добавить' : 'Редактировать'"
					v-close-popup
					@click="editNews"
				/>
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import { ref, toRefs } from 'vue'

export default {
	props: {
		msgText: {
			type: Object,
			required: true
		},
		msgType: {
			type: Boolean,
			required: false,
			default: true
		}
	},
	emits: ['isChange', 'isNew'],
	setup(props, { emit }) {
		const newsData = ref('')

		newsData.value = toRefs(props.msgText)

		const editNews = () => {
			if (props.msgType) {
				emit('isNew')	// создать новую новость
			} else {
				emit('isChange') // изменить новость
			}
		}

		return { newsData, editNews }
	}
}
</script>
