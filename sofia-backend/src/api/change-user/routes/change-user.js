module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/change-user",
      handler: "change-user.changePassword",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
