const { authJwt } = require("../middleware");
const controller = require("../controllers/listing.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get(
      "/api/listings",
      controller.getAllListings
    );
    
    app.get(
      "/api/activeListings",
      controller.getActiveListings
    );
  
    app.get(
      "/api/listings/user",
      controller.getUserListings
    );

    app.post(
      "/api/listing/create",
      [authJwt.verifyToken],
      controller.createListing
    );

    app.get(
      "/api/listing",
      controller.getListing
    );

    app.post(
      "/api/listing",
      [authJwt.verifyToken],
      controller.postListing
    );

    app.get(
      "/api/listing/cancel",
      [authJwt.verifyToken],
      controller.cancelListing
    );

    app.get(
      "/api/listing/soldStatus",
      controller.soldListingStatus
    );
  };