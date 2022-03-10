// ФИО первая буква заглавная, остальные строчные
// после пробела первая буква заглавная - остальные строчные
// функция не зависит от локали
//
export const formatFio = (fio) => {
  let res = fio.trim().toLowerCase()
  res = res.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
  return res
}
