<!--
Виды input:
	type="tel" 			- телефон
	type="password"	- пароль
 -->
<template>
	<q-input
		:type="type"
		:label="inputData.label"
		:mask="inputData.mask"
		unmasked-value
		outlined
		:rules="inputData.rules"
	>
		<template v-slot:prepend>
			<q-icon :name="inputData.icon" />
		</template>
	</q-input>

	<!-- password -->
	<!-- <q-input
		label="пароль"
		type="password"
		outlined
		:rules="[isValidPassword]"
		maxlength="32"
	>
		<template v-slot:prepend>
			<q-icon name="lock" class="block" />
		</template>
	</q-input>-->
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
	setup(props) {

		// check tel
		const isValidPhone = (phone) => new Promise((resolve) => {
			setTimeout(() => {
				resolve(phone.length === 10 || 'Введите корректный номер')
			}, 1000)
		})

		// check password
		const isValidPassword = (password) => new Promise((resolve) => {
			setTimeout(() => {
				resolve(password.length > 5 || 'Введен короткий пароль')
			}, 1000)
		})

		const inputData = {}

		if (props.type === 'tel') {
			Object.assign(inputData, {
				label: 'номер телефона',
				mask: '+7 (###) ###-##-##',
				icon: 'phone',
				rules: [isValidPhone]
			})
		} else {
			Object.assign(inputData, {
				label: 'пароль',
				mask: '',
				icon: 'lock',
				rules: [isValidPassword]
			})
		}

		return { isValidPhone, isValidPassword, inputData }
	}
}
</script>
