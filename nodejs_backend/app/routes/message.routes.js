const { authJwt } = require("../middleware");
const controller = require("../controllers/message.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get(
        "/api/lastMessages",
        [authJwt.verifyToken],
        controller.getLastMessages
    );

    app.get(
        "/api/messages",
        [authJwt.verifyToken],
        controller.getMessages
    );

    app.get(
        "/api/newMessages",
        [authJwt.verifyToken],
        controller.getUnseenMessageAmount
    );


    app.post(
        "/api/message",
        [authJwt.verifyToken],
        controller.postMessage
    );
}