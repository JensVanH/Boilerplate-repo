const { authJwt } = require("../middleware");
const controller = require("../controllers/transaction.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get(
      "/api/transactions/listing",
      [authJwt.verifyToken],
      controller.getListingTransactions
    );
  
    app.get(
      "/api/transactions/user",
      [authJwt.verifyToken],
      controller.getUserTransactions
    );
  
    app.post(
      "/api/transaction/create",
      [authJwt.verifyToken],
      controller.createTransaction
    );

    app.get(
      "/api/transaction/cancel",
      [authJwt.verifyToken],
      controller.cancelTransaction
    );

    app.get(
      "/api/transaction/confirmPayment",
      [authJwt.verifyToken],
      controller.confirmPayment
    );

    app.get(
      "/api/transaction",
      controller.getTransaction
    );
  };