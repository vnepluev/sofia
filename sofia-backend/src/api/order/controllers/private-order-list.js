/**
 * Список заказов в диапазоне дат
 *
 * Принимаем:
 * date_start - дата начала UTC
 * date_end - дата завершения UTC
 */
module.exports = {
  async getPrivateOrderList(ctx) {
    const { date_start, date_end } = ctx.request.body;
    const dateStart = new Date(date_start);
    const dateEnd = new Date(date_end);

    // проверка диапазона дат
    const checkDate =
      dateStart.toString() === "Invalid Date" ||
      dateEnd.toString() === "Invalid Date" ||
      dateEnd < dateStart;

    if (checkDate) return ctx.throw(400, "Date-Diapason-isInvalid");

    // к dateEnd + 1 день для правильного вывода
    dateEnd.setDate(dateEnd.getDate() + 1);

    const entries = await strapi.db.query("api::order.order").findMany({
      populate: {
        user_id: {
          select: ["username", "fio", "phone2", "telegram_nickname"],
        },
      },
      where: {
        $and: [
          { date_start: { $gte: dateStart } },
          { date_end: { $lte: dateEnd } },
        ],
      },
    });

    ctx.body = entries;
  },
};
