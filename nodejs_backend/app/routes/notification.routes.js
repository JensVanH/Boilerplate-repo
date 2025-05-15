const { authJwt } = require("../middleware");
const controller = require("../controllers/notification.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get(
      "/api/notifications",
      [authJwt.verifyToken],
      controller.getUserNotifications
    );
  
    app.get(
      "/api/notification/markViewed",
      [authJwt.verifyToken],
      controller.markNotificationAsViewed
    );

    app.delete(
      "/api/notification",
      [authJwt.verifyToken],
      controller.deleteNotifications
    );
  };