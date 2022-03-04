export const checkFio = (fio) => {
  const res = /^[а-я А-Яa-zA-Z]+$/gim.test(fio.trim()) && fio.length > 1
  return res
}

export const checkEmail = (email) => {
  const res = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)
  return res
}

export const checkPassword = (password) => {
  const res = password.length > 5
  return res
}

export const checkPhone = (phone) => {
  const res = phone.length === 10
  return res
}
