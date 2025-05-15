/* ==================== ORGANIZATION ROUTES ==================== */

const { authJwt } = require("../middleware");
const controller = require("../controllers/organization.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Get all organizations
    app.get(
        "/api/organizations",
        //[authJwt.verifyToken], // <-- Protect this route
        controller.getAllOrganizations
    );

    // Get verifiers of a specific organization
    app.get(
        "/api/organizations/:organizationID/verifiers",
        //[authJwt.verifyToken], // <-- Protect this route
        controller.getVerifiersByOrganization
    );
};
