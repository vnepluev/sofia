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
  ],
};
