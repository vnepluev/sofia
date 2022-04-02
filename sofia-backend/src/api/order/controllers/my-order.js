module.exports = {
  // ===
  // получаем список заказов пользователя
  // ===
  async getMyOrders(ctx) {
    const currentUserId = ctx.state.user.id; // id текущего пользователя

    const entries = await strapi.db.query("api::order.order").findMany({
      populate: ["user_id"],
      where: {
        user_id: currentUserId,
      },
    });

    // удаляем лишние данные
    entries.forEach((el) => {
      el["username"] = el["user_id"].username;
      delete el["user_id"];
      delete el["createdAt"];
      delete el["updatedAt"];
    });

    ctx.body = entries;
  },
};
