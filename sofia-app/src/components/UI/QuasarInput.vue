<!--
Виды input:
	type="tel" 			- телефон
	type="password"	- пароль
 -->
<template>
	<q-input
		v-if="type === 'tel'"
		type="tel"
		label="номер телефона"
		mask="+7 (###) ###-##-##"
		unmasked-value
		outlined
		:rules="[isValid]"
	>
		<template v-slot:prepend>
			<q-icon name="phone" />
		</template>
	</q-input>
</template>

<script>

export default {
	props: {
		type: {
			validator(value) {
				return ['tel', 'password'].includes(value)
			}
		}
	},
	/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }] */
	// eslint-disable-next-line
	setup(props, { emit }) {
		const isValid = (phone) => new Promise((resolve) => {
			setTimeout(() => {
				resolve(phone.length === 10 || 'Введите корректный номер')
			}, 1000)
		}).finally((res) => {
			if (typeof res === 'boolean') emit('isValid', true)
		})

		return { isValid }
	}
}
</script>
