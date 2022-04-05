"use strict";

/**
 * A set of functions called "actions" for `users`
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
          limit: 15,
        });

      // ctx.body = [{ total_entries: count }, ...users]; // ответ пользователю
      ctx.body = [{ total_entries: count }, ...users]; // ответ пользователю
    } catch (error) {
      return ctx.throw(500, "current-password-wrong");
    }
  },
};
