// работа с логическими операциями
// https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine/filtering.html#logical-operators
// $gte - больше или равен
// $lte - меньше или равен
// https://learn.javascript.ru/datetime

module.exports = {
  // ===
  // расписание яхт на 10 дней
  // ===
  async getPublicOrders(ctx) {
    const dateNow = new Date();
    const dateEnd = new Date();

    dateEnd.setDate(dateNow.getDate() + 10);

    const entries = await strapi.db.query("api::order.order").findMany({
      select: ["id", "date_start", "date_end"],
      where: {
        $and: [
          { date_start: { $gte: dateNow } },
          { date_end: { $lte: dateEnd } },
        ],
      },
      orderBy: { id: "DESC" },
    });

    const result = Object.keys(entries).map((el) => {
      entries[el].bgcolor = "blue"; // фоновый цвет
      entries[el].title = "Забронировано"; // заголовок

      const startTime = new Date(entries[el].date_start);
      const endTime = new Date(entries[el].date_end);

      const resultTime = startTime.toLocaleString("ru", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const resultDate = startTime.toLocaleString("ru", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      entries[el].details = `${resultTime} бронь`; // подсказка
      entries[el].time = resultTime; // время начала
      entries[el].date = resultDate; // дата начала
      entries[el].duration = (endTime - startTime) / (60 * 1000); // продолжительность в минутах

      return entries[el];
    });

    ctx.body = result;
  },
};
