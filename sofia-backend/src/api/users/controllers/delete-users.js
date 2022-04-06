/**
 * Удаляем пользователей
 * Принимаем:
 * ['9050224001', '9050224002'...] - список пользователей
 */
module.exports = {
  async deleteUsers(ctx) {
    try {
      const userArr = ctx.request.body;

      for (let i = 0; i < userArr.length; i++) {
        await strapi.db.query("plugin::users-permissions.user").delete({
          where: {
            username: userArr[i],
          },
        });
      }

      console.log(userArr);

      ctx.body = userArr;
    } catch (error) {
      return ctx.throw(400, "Cant-Delete-Users");
    }
  },
};
