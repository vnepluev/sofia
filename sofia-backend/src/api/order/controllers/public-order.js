// работа с логическими операциями
// https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine/filtering.html#logical-operators
// $gte - больше или равен
// $lte - меньше или равен
// https://learn.javascript.ru/datetime
// https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
// https://only-to-top.ru/blog/coding/2019-08-11-vychitanie-dat-javascript.html

module.exports = {
  // ===
  // расписание яхт на 10 дней
  // ===
  async getPublicOrders(ctx) {
    const dateNow = new Date();
    const dateEnd = new Date();

    dateEnd.setDate(dateNow.getDate() + 10);

    const entries = await strapi.db.query("api::order.order").findMany({
      select: ["id", "date_start", "date_end", "order_status"],
      where: {
        $and: [
          { date_start: { $gte: dateNow } },
          { date_end: { $lte: dateEnd } },
          {
            order_status: {
              $in: ["Забронирован", "Завершен"],
            },
          },
        ],
      },
      orderBy: { id: "DESC" },
    });

    console.log(dateNow);

    const result = Object.keys(entries).map((el) => {
      entries[el].bgcolor = "blue"; // фоновый цвет
      entries[el].title = "Забронировано"; // заголовок

      const startTime = new Date(entries[el].date_start);
      const endTime = new Date(entries[el].date_end);

      const startTimeStart = startTime.toLocaleString("ru", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endTimeStart = endTime.toLocaleString("ru", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const resultDate = startTime
        .toLocaleString("ru", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })
        .split(".")
        .reverse()
        .join("-");

      entries[el].time_end = endTimeStart; // подсказка
      entries[el].time = startTimeStart; // время начала
      entries[el].date = resultDate; // дата начала
      entries[el].duration = (endTime - startTime) / (60 * 1000); // продолжительность в минутах

      return entries[el];
    });

    ctx.body = result;
  },
};
