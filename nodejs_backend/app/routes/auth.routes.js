const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Register Regular User
  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateEmail],
    controller.signup
  );

 
  // Register Verifier
  app.post(
    "/api/auth/signup/verifier",
    [verifySignUp.checkDuplicateEmail],
    controller.signupVerifier
  );

  app.post("/api/auth/signin", controller.signin);
};