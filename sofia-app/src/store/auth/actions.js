import { api } from 'src/boot/axios'

/**
 * Устанавливаем новый токен
 */
const setToken = (response, commit) => {
  // проверяем правильность пароля
  if (!response.data.code === 200) {
    throw new Error()
  }
  const token = response.data.jwt
  commit('setToken', token) // mutations token
  commit('setMe', response.data.user) // save user info
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

/**
 * логинимся на сервер (вход в систему)
 */
export const doLoginAction = async ({ commit }, payload) => {
  await api.post('/auth/local', payload).then((response) => {
    setToken(response, commit)
  })
}

/**
 * регистрация нового пользователя и вход в систему
 */
export const registerNewUserAction = async ({ commit }, userData) => {
  delete userData.confirmPassword
  await api.post('/auth/local/register', userData).then((response) => {
    setToken(response, commit)
  })
}

export const init = async ({ commit }) => {
  //
  const token = localStorage.getItem('token')
  if (token) {
    await commit('setToken', JSON.parse(token))
  } else {
    commit('removeToken')
  }
}

export const signOut = ({ commit }) => {
  api.defaults.headers.common.Authorization = ''
  commit('removeToken')
}

/**
 * смена пароля пользователя
 */
export const changePasswordAction = async ({ commit }, newPassword) => {
  const data = {
    username: newPassword.username,
    current_password: newPassword.currentPass,
    new_password: newPassword.pass1,
  }
  await api.put('/change-user', data).then((response) => {
    setToken(response, commit)
  })
}

/**
 * смена пароля пользователя
 * userData: { fio: '', phone2: '' }
 */
export const changeUserDataAction = async ({ commit }, userData) => {
  console.log(userData)
  console.log(commit)
  // await api.put('/change-user', data).then((response) => {
  //   setToken(response, commit)
  // })
}

// export const getMe = async ({ commit, dispatch }, token) => {}
