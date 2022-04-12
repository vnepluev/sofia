export const isAuth = (state) => state.isAuth

export const getToken = (state) => {
  if (!state.token) {
    const token = localStorage.getItem('token')
    if (token) {
      state.token = JSON.parse(token)
    }
  }
  return state.token
}

export const getMe = (state) => state.me

export const getOrderList = (state) => state.orderList

export const getOrderListId = (state, getters) => (id) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  getters.getOrderList.find((el) => +el.id === +id)
