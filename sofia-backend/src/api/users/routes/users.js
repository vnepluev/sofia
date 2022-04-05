module.exports = {
  routes: [
    {
      method: "GET",
      path: "/user-list",
      handler: "users.getUserList",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
