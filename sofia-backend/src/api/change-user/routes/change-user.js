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
    {
      method: "PUT",
      path: "/change-user-data",
      handler: "change-user.changeUserData",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
