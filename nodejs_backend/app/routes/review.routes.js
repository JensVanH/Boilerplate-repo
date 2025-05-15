const { authJwt } = require("../middleware");
const controller = require("../controllers/review.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
      "/api/review",
      [authJwt.verifyToken],
      controller.postReview
    );
  
    app.get(
      "/api/reviews/listing",
      controller.getListingReviews
    );

    app.get(
      "/api/reviews/user",
      controller.getUserReviews
    );
  };