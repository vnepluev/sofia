export const checkFio = (fio) => {
  let res = false
  if (fio !== null || fio !== undefined || fio.length < 1) {
    res = /^[а-я А-Яa-zA-Z]+$/gim.test(fio?.trim()) && fio?.length > 1
  }
  return res
}

export const checkEmail = (email) => {
  const res = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)
  return res
}

export const checkPassword = (password) => password?.length > 5

export const checkPhone = (phone) => phone?.length === 10
