import { api } from 'src/boot/axios'

export const isAuth = (state) => state.isAuth

export const getToken = (state) => state.token

export const getMe = (state) => {
  //   api.get('/api/')
  console.log(state, api)
  return state.me
}
