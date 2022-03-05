export const setToken = (state, token) => {
  state.token = token
  state.isAuth = true
  localStorage.setItem('token', JSON.stringify(token))
}

export const removeToken = (state) => {
  state.token = ''
  state.isAuth = false
}

// после входа в систему, сервер возвращает все данные о пользователе
export const setMe = (state, me) => {
  state.me = me
}
