<!--
Иконки https://fonts.google.com/icons?icon.query=text

Виды input:
	type="tel" 					- телефон
	type="tel-novalidate" 	- телефон
	type="password"			- пароль
	type="text"					- текст
 -->
<template>
	<q-input
		:type="type"
		:label="inputData.label"
		:mask="inputData.mask"
		unmasked-value
		:rules="inputData.rules"
		maxlength="32"
	>
		<template v-slot:prepend>
			<q-icon :name="inputData.icon" />
		</template>
	</q-input>
</template>

<script>

export default {
	props: {
		type: {
			validator(value) {
				return ['tel', 'password', 'text'].includes(value)
			}
		},
		label: {
			require: false,
			default: ''
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

		const inputData = {
			label: props.label
		}

		switch (props.type) {
			// tel
			case 'tel': Object.assign(inputData, {
				mask: '+7 (###) ###-##-##',
				icon: 'phone',
				maxlength: 0,
				rules: [isValidPhone]
			})
				break
			// password
			case 'password': Object.assign(inputData, {
				mask: '',
				icon: 'lock',
				maxlength: 32,
				rules: [isValidPassword]
			})
				break
			// text
			default: {
				Object.assign(inputData, {
					mask: '',
					icon: 'format_quote',
					maxlength: 32,
					rules: []
				})
			}
		}

		return { isValidPhone, isValidPassword, inputData }
	}
}
</script>
