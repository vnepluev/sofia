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
    {
      method: "PUT",
      path: "/ban-users",
      handler: "ban-users.banUsers",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/unban-users",
      handler: "unban-users.unBanUsers",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "PUT",
      path: "/delete-users",
      handler: "delete-users.deleteUsers",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
