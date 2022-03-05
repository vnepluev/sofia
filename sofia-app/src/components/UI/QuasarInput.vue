<!--
Иконки https://fonts.google.com/icons?icon.query=text

Виды input:
	type="fio"					- ФИО
	type="tel" 					- телефон
	type="tel-novalidate" 	- телефон
	type="password"			- пароль
	type="email"				- e-mail
 -->
<template>
	<q-input
		:type="inputData.type"
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
import { checkFio, checkEmail, checkPassword, checkPhone } from '../Helpers/CheckData.js'

export default {
	props: {
		type: {
			validator(value) {
				return ['tel', 'password', 'email', 'fio'].includes(value)
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
				resolve(checkPhone(phone) || 'Введите корректный номер')
			}, 1000)
		})

		// check password
		const isValidPassword = (password) => new Promise((resolve) => {
			setTimeout(() => {
				resolve(checkPassword(password) || 'Введен короткий пароль')
			}, 1000)
		})

		// check email
		const isValidEmail = (email) => new Promise((resolve) => {
			setTimeout(() => {
				resolve(checkEmail(email) || 'Введите корректный e-mail')
			}, 1000)
		})

		// check fio
		const isValidFio = (fio) => new Promise((resolve) => {
			setTimeout(() => {
				resolve(checkFio(fio) || 'Введите ваше имя')
			}, 1000)
		})

		const inputData = {
			label: props.label
		}

		switch (props.type) {
			// tel
			case 'tel': Object.assign(inputData, {
				type: 'tel',
				mask: '+7 (###) ###-##-##',
				icon: 'phone',
				maxlength: 0,
				rules: [isValidPhone]
			})
				break
			// password
			case 'password': Object.assign(inputData, {
				type: 'password',
				mask: '',
				icon: 'lock',
				maxlength: 32,
				rules: [isValidPassword]
			})
				break
			// email
			case 'email': Object.assign(inputData, {
				type: 'email',
				mask: '',
				icon: 'alternate_email',
				maxlength: 128,
				rules: [isValidEmail]
			})
				break
			// fio
			default: {
				Object.assign(inputData, {
					type: 'text',
					mask: '',
					icon: 'face',
					maxlength: 32,
					rules: [isValidFio]
				})
			}
		}

		return { inputData }
	}
}
</script>
