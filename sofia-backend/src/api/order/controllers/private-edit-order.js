/**
 * Админка: редактируем заказ
 *
 * Принимаем:
 * - объект с параметрами заказа яхты
 */
module.exports = {
  async privateEditOrder(ctx) {
    try {
      const data = ctx.request.body;

      const entry = await strapi.entityService.update(
        "api::order.order",
        +data.id,
        {
          data: {
            ...data,
          },
        }
      );

      ctx.body = data;
    } catch (error) {
      return ctx.throw(400, "Private-Order-Edit-Error");
    }
  },
};
