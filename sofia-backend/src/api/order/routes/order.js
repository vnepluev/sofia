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
  ],
};
