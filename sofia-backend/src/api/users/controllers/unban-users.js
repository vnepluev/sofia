/**
 * Разбаним пользователей
 * Принимаем:
 * ['9050224001', '9050224002'...] - список пользователей
 */
module.exports = {
  async unBanUsers(ctx) {
    try {
      const userArr = ctx.request.body;

      const query = [];
      for (let i = 0; i < userArr.length; i++) {
        query.push({ username: userArr[i] });
      }

      await strapi.db.query("plugin::users-permissions.user").updateMany({
        where: {
          $or: [...query],
        },
        data: {
          blocked: false,
        },
      });

      ctx.body = userArr;
    } catch (error) {
      return ctx.throw(400, "Cant-Update-Users-Right");
    }
  },
};
