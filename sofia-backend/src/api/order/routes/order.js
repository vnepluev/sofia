"use strict";

/**
 * order router.
 */
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-order",
      handler: "order.createOrder",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/public-orders",
      handler: "public-order.getPublicOrders",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/my-orders",
      handler: "my-order.getMyOrders",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // Админ: список заказов в диапазоне дат
    {
      method: "POST",
      path: "/private-order-list",
      handler: "private-order-list.getPrivateOrderList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
