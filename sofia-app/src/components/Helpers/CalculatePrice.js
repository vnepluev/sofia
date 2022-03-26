const YACHT_HOURS_PRICE = 3500 // стоимость часа аренда яхты
const SUP_PRICE = 1000 // часовая аренда сапа
const WATER_CIRCLE_PRICE = 500 // часовая аренда ватрушки
const PHOTO_PRICE = 3000 // стоимость фотосессии

/**
 * Высчитываем финальную стоимость аренды
 */

// принимаем:
// duration - массив со значениями ('1 час', '1,5 часа'...)
// durationValue - выбранное значение
//
// возвращаем:
// 30 минутные интервалы аренды яхты, стоимость
export const rentYachtPrice = (duration, durationValue) => {
  const position = duration.findIndex((item) => item === durationValue)
  const price = YACHT_HOURS_PRICE + position * (YACHT_HOURS_PRICE / 2)
  const hours = position + 2 // (0 + 2 * 30) мин = 1 час
  return { hours, price }
}

// аренда сап бордов
export const rentSupPrice = (sup, supValue) => {
  const count = sup.findIndex((item) => item === supValue)
  const price = count * SUP_PRICE
  return { count, price }
}

// аренда ватрушек
export const rentWaterCirclePrice = (waterCircle, waterCircleValue) => {
  const count = waterCircle.findIndex((item) => item === waterCircleValue)
  const price = count * WATER_CIRCLE_PRICE
  return { count, price }
}

// фотосессия
export const photoPrice = () => PHOTO_PRICE

// вычисляем дату
// https://stackoverflow.com/questions/85116/display-date-time-in-users-locale-format-and-time-offset
// new Date(year, month, date, hours, minutes, seconds, ms)
//
// принимаем
// dateStart - дату/время начала прогулки
// duration - массив ['1 час', '1,5 часа'...]
// durationValue - значение массива '1 час'
//
// возвращаем
// - дату/время завершения прогулки
//
export const calcEndDate = (dateStart, duration, durationValue) => {
  const { hours } = rentYachtPrice(duration, durationValue)

  const dateEnd = new Date(dateStart)
  dateEnd.setMinutes(dateStart.getMinutes() + hours * 30)

  return dateEnd
}
