/**
 * Проверка на занятость диапазона дат
 *
 * Принимаем:
 * date_start - дата начала UTC
 * date_end - дата завершения UTC
 * id - нужно для проверки каким событием занята дата
 * yacht_name - название яхты
 */
module.exports = {
  async checkDataInterval(ctx) {
    const { date_start, date_end, id, yacht_name } = ctx.request.body;
    const dateStart = new Date(date_start);
    const dateEnd = new Date(date_end);

    // проверка id на число
    if (isNaN(parseFloat(id)) && !isFinite(id))
      return ctx.throw(400, "ID-Not-Number");

    // проверка диапазона дат
    const checkDate =
      dateStart.toString() === "Invalid Date" ||
      dateEnd.toString() === "Invalid Date" ||
      dateEnd < dateStart;

    if (checkDate) return ctx.throw(400, "Date-Diapason-isInvalid");

    // проверка на занятую дату
    const entries = await strapi.db.query("api::order.order").findOne({
      select: ["id", "yacht_name", "date_start", "date_end", "order_status"],
      where: {
        $and: [
          // БД <= Start
          { date_start: { $lte: dateStart } },
          // БД >= Start
          { date_end: { $gte: dateStart } },
        ],
        $and: [
          // БД <= End
          { date_start: { $lte: dateEnd } },
          // БД >= Start
          { date_end: { $gte: dateStart } },
        ],
        order_status: {
          $in: ["Забронирован", "Завершен"],
        },
        id: {
          $ne: id,
        },
        yacht_name: yacht_name,
      },
    });

    // если дата занята
    if (entries !== null) entries.status = "busy";

    ctx.body = entries;
  },
};
