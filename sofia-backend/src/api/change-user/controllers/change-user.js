"use strict";

/**
 * changePassword controller
 * https://strapi.io/blog/using-database-transactions-to-write-queries-in-strapi
 */

const bcrypt = require("bcryptjs");

module.exports = {
  async changePassword(ctx) {
    const { username, current_password, new_password } = ctx.request.body; // username текущего пользователя

    if (!username || !current_password || !new_password) {
      return ctx.throw(400, "Provide-userId-currentPassword-newPassword");
    }

    // ищем пользователя в БД
    let user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { username: username } }); // , password: hashPassword

    // current_password === user.password
    const validPassword = await strapi
      .service("plugin::users-permissions.user")
      .validatePassword(current_password, user.password);

    // пароль совпадает?
    if (!validPassword) {
      return ctx.throw(401, "current-password-wrong");
    } else {
      // Generate new hashed password
      const newHashPassword = bcrypt.hashSync(new_password, 10);
      user = await strapi.query("plugin::users-permissions.user").update({
        where: { username: username },
        data: { resetPasswordToken: null, password: newHashPassword },
      });

      // Возвращаем новый jwt token
      ctx.send({
        jwt: strapi.service("plugin::users-permissions.jwt").issue({
          username: username,
        }),
        user: user,
      });
    }
  },
};

// const entries = await strapi.db.query("api::user.user").findMany({
//   select: ["*"],
// });

// const entry = await strapi.db
//   .query("plugin::users-permissions.user")
//   .findOne({ where: { email: email } });

// await strapi.plugins[“users-permissions”].services.user.hashPassword({ password })
// https://forum.strapi.io/t/applying-isowner-policy-to-user-permissions-plugin/1782/2

// ctx.body = "Password valid: " + validPassword
/*
	ctx.query = { 'ingridients.ingridient_in': [ 'rice', 'tuna' ] }
*/
