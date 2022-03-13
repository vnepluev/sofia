"use strict";

/**
 * changePassword controller
 * https://strapi.io/blog/using-database-transactions-to-write-queries-in-strapi
 */

const bcrypt = require("bcryptjs");

module.exports = {
  // ===
  // меняем ФИО и/или Телефон
  // ===
  async changeUserData(ctx) {
    const { username, fio, phone2 } = ctx.request.body;
    const currentUser = ctx.state.user.username; // username текущего пользователя

    // проверяем совпадают ли пользователи
    if (currentUser !== username) {
      return ctx.throw(400, "User-Restrict-Area");
    }

    // объект с ФИО и phone2
    const reqUserData = {};

    // проверка ФИО
    let res = false;
    if (fio !== null || fio !== undefined || fio.length < 1) {
      res = /^[а-я А-Яa-zA-Z]+$/gim.test(fio?.trim()) && fio?.length > 1;
    }
    if (!res) {
      return ctx.throw(400, "Bad-User-Name");
    }
    reqUserData.fio = fio;

    // проверка phone2
    res = false;

    if (phone2 === null || phone2 === undefined || phone2.length < 1) {
      // если пустое значение phone2, пропускаем
      res = true;
    } else if (phone2.length === 10) {
      res = /^[0-9]+$/gim.test(phone2);
      reqUserData.phone2 = phone2;
    }
    if (!res) {
      return ctx.throw(400, "Bad-Phone2-Number");
    }

    // меняем фио/тел2 на новые значения в БД
    let user = await strapi.query("plugin::users-permissions.user").update({
      where: { username: username },
      data: { ...reqUserData },
    });

    ctx.body = reqUserData;
  },

  // ===
  // меняем пароль
  // ===
  async changePassword(ctx) {
    const { username, current_password, new_password } = ctx.request.body; // username текущего пользователя
    const currentUser = ctx.state.user.username; // username текущего пользователя

    if (!username || !current_password || !new_password) {
      return ctx.throw(400, "Provide-userId-currentPassword-newPassword");
    }

    // проверяем совпадают ли пользователи
    if (currentUser !== username) {
      return ctx.throw(400, "User-Restrict-Area");
    }

    // ищем пользователя в БД
    let user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({ where: { username: username } });

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

// await strapi.plugins[“users-permissions”].services.user.hashPassword({ password })
// https://forum.strapi.io/t/applying-isowner-policy-to-user-permissions-plugin/1782/2

/*
	ctx.query = { 'ingridients.ingridient_in': [ 'rice', 'tuna' ] }
*/
