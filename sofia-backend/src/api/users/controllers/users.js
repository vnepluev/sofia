"use strict";

/**
 * Возвращает список всех зарегистрированных пользователей
 * Todo: // limit: 10 - ограничить отправку пользователей
 */

module.exports = {
  async getUserList(ctx) {
    try {
      const [users, count] = await strapi
        .query("plugin::users-permissions.user")
        .findWithCount({
          select: [
            "username",
            "fio",
            "phone2",
            "blocked",
            "telegram_nickname",
            "group",
            "createdAt",
          ],
          sort: { createdAt: "DESC" },
          offset: 0,
          //limit: 10,
        });

      ctx.body = [{ total_entries: count }, ...users]; // ответ пользователю
    } catch (error) {
      return ctx.throw(400, "Cant-Get-List-Of-Users");
    }
  },
};
