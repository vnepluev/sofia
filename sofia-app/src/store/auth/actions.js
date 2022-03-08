import { api } from 'src/boot/axios'

// логинимся на сервер и получаем jwt token, если ок
export const doLoginAction = async ({ commit }, payload) => {
  await api.post('/auth/local', payload).then((response) => {
    // console.log(response.data)
    // проверяем правильность пароля
    if (!response.data.code === 200) {
      throw new Error('Введите корректный логин/пароль')
    }
    const token = response.data.jwt
    commit('setToken', token) // mutations token
    commit('setMe', response.data.user) // save user info
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  })
}

// регистрируем пользователя в системе, получаем JWT token и входим в систему
// код пишем тут
export const registerNewUserAction = async ({ commit }, userData) => {
  delete userData.confirmPassword
  await api.post('/auth/local/register', userData).then((response) => {
    console.log(response.data)
    // проверяем правильность пароля
    if (!response.data.code === 200) {
      throw new Error('Ошибка при регистрации нового пользователя')
    }
    const token = response.data.jwt
    commit('setToken', token) // mutations token
    commit('setMe', response.data.user) // save user info
    api.defaults.headers.common.Authorization = `Bearer ${token}`
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

// export const getMe = async ({ commit, dispatch }, token) => {}
