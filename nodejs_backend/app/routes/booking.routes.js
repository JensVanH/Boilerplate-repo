const { authJwt } = require("../middleware");
const controller = require("../controllers/booking.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });


    app.get(
      "/api/booking",
      [authJwt.verifyToken],
      controller.getBooking
    );

    app.get(
      "/api/transaction/bookings",
      [authJwt.verifyToken],
      controller.getBookingsOnTransaction
    );

    app.get(
      "/api/listing/bookings",
      controller.getListingBookingsByMonth
    );

    app.post(
      "/api/booking",
      [authJwt.verifyToken],
      controller.createBooking
    );

    app.post(
      "/api/booking/info",
      [authJwt.verifyToken],
      controller.updateBookingInfo
    )
}