const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/userdata",
    [authJwt.verifyToken],
    controller.postUserData
  );

  app.get(
    "/api/userdata",
    [authJwt.verifyToken],
    controller.getUserData
  );

  app.post(
    "/api/user/changePassword",
    [authJwt.verifyToken],
    controller.changePassword
  );

  app.get(
    "/api/userPicture",
    controller.getProfilePicture
  );

  app.get(
    "/api/user/userrating",
    [authJwt.verifyToken],
    controller.getUserRating
  )

  app.get(
    "/api/user/sellerrating",
    controller.getSellerRating
  )
};