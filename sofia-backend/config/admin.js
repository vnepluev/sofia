module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '3276cc531a66405cd1221ebe8cadb090'),
  },
});
