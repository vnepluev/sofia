// Проверить дату, входит ли в указанный диапазон
// https://qna.habr.com/q/555676

// правильный вывод ошибки
//  catch (err) {
//    return 500 error
//    ctx.response.status = 500;
//    return { error: { message: "There was a problem creating the charge" } };
//  }

module.exports = {
  // ===
  // создаем новый заказ на аренду яхт
  // ===
  async createOrder(ctx) {
    const { date_start, date_end, people_count } = ctx.request.body;
    const { comment, promocode } = ctx.request.body;
    const { photo, sup_board, water_circle, yacht_name } = ctx.request.body;
    const { sert_number, sert_booking_code, sert_done_code } = ctx.request.body;
    const currentUserId = ctx.state.user.id; // id текущего пользователя

    // Финальный объект
    const reqUserData = {};

    // проверка сертификата
    if (sert_number?.length > 0) {
      if (sert_number?.length !== 16 || sert_booking_code?.length !== 3)
        return ctx.throw(400, "Broken-Cert-Number");
      reqUserData.sert_number = sert_number;
      reqUserData.sert_booking_code = sert_booking_code;
      if (reqUserData.sert_done_code?.length > 0)
        reqUserData.sert_done_code = sert_done_code;
    }

    // кол-во пассажиров (проверка на число)
    if (!isNaN(parseFloat(people_count)) && isFinite(people_count))
      reqUserData.people_count = +people_count;
    else return ctx.throw(400, "People-Count-isInvalid");

    /**
     * дата/время отплытия
     */
    const dateNow = new Date(); // текущая дата/время
    const dateStart = new Date(date_start); // дата/время отплытия
    const dateEnd = new Date(date_end); // дата/время прибытия

    // проверка дат начало-завершение отплытия
    const checkDate =
      dateStart.toString() === "Invalid Date" ||
      dateEnd.toString() === "Invalid Date" ||
      dateEnd < dateStart ||
      dateNow > dateStart ||
      dateStart.getTime() === dateEnd.getTime();
    if (checkDate) return ctx.throw(400, "Date-Start-isInvalid");

    // проверка на занятую дату
    const entries = await strapi.db.query("api::order.order").findOne({
      select: ["id", "date_start", "date_end", "order_status"],
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
      },
    });

    if (entries !== null) return ctx.throw(405, "Date-isBusy");

    reqUserData.date_start = dateStart;
    reqUserData.date_end = dateEnd;

    /**
     * комментарий, промокод
     */
    reqUserData.comment = comment;
    reqUserData.promocode = promocode;

    /**
     * Фотосессия / сапы / ватрушки / имя яхты
     */
    reqUserData.photo = !!photo;

    // sup
    if (!isNaN(parseFloat(sup_board)) && isFinite(sup_board))
      reqUserData.sup_board = +sup_board;
    else return ctx.throw(400, "SupBoard-Count-isInvalid");

    // water_circle
    if (!isNaN(parseFloat(water_circle)) && isFinite(water_circle))
      reqUserData.water_circle = +water_circle;
    else return ctx.throw(400, "WaterCircle-Count-isInvalid");

    // yacht_name = sofia
    if (yacht_name.includes("sofia")) reqUserData.yacht_name = yacht_name;
    else return ctx.throw(400, "YachtName-isInvalid");

    /**
     * Сохраняем в БД
     */
    await strapi.db.query("api::order.order").create({
      data: {
        user_id: currentUserId,
        ...reqUserData,
      },
    });

    ctx.body = reqUserData;
  },
};
