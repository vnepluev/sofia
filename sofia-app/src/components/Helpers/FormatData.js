import { date } from 'quasar'

// ФИО первая буква заглавная, остальные строчные
// после пробела первая буква заглавная - остальные строчные
// функция не зависит от локали
//
export const formatFio = (fio) => {
  let res = fio.trim().toLowerCase()
  res = res.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase())
  return res
}

/**
 * Преобразуем дату и время
 * принимаем dt = '25.04.2022, 09:40'
 * return ['YYYY-MM-DD', 'HH:mm']
 */
export const formatDateTime = (dt) => {
  const d = dt.split(',')[0].split('.')
  const d1 = date.buildDate({ year: d[2], month: d[1], date: d[0] })

  const t = dt.split(',')[1].split(':')
  const t1 = date.buildDate({ hours: t[0], minutes: t[1] })

  return [date.formatDate(d1, 'YYYY-MM-DD'), date.formatDate(t1, 'HH:mm')]
}
