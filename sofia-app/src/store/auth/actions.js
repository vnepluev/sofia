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
 * инициализируем переменные для сессии
 */
export const init = async ({ commit }) => {
  const token = JSON.parse(localStorage.getItem('token'))
  if (token) {
    await commit('setToken', token)
    // информацию о пользователе в store
    // eslint-disable-next-line
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    // api.get('/users/me', { headers: { Authorization: `Bearer ${token}` }, })
    await api
      .get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        commit('setMe', response.data)
      })
  } else {
    commit('removeToken')
  }
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

/**
 * Завершить сессию
 */
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
  await api.put('/change-user-data', userData).then((response) => {
    commit('setFioPhone2', response)
  })
}

/**
 * удаляем новость
 */
export const deleteNews = async (_, newsId) => {
  await api.delete(`/news/${newsId}`)
}

/**
 * получить все новости
 */
export const getAllNewsAction = async ({ commit }) => {
  const news = await api.get('/news?sort=id:desc').then((res) => res.data.data)
  commit('setAllNews', news)
}

// export const getMe = async ({ commit, dispatch }, token) => {}

/**
 * Получаем список заказов с сервера
 * /admin/order-list
 *
 * - дата начала
 * - дата завершения
 */
export const getOrderList = async ({ commit }, dateInterval) => {
  const orderList = await api.post('/private-order-list', {
    date_start: dateInterval.dateStart,
    date_end: dateInterval.dateEnd,
  }) // массив с заказами

  commit('getOrderList', orderList.data)
}
