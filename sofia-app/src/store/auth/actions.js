import { api } from 'src/boot/axios'

// логинимся на сервер и получаем jwt token, если ок
export const doLoginAction = async ({ commit }, payload) => {
  await api.post('/auth/local', payload).then((response) => {
    console.log(response.data)
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

// export const signOut = ({ commit }) => {}

// export const getMe = async ({ commit, dispatch }, token) => {}
