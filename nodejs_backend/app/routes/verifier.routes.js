/* ==================== VERIFIER ROUTES ==================== */
const { authJwt } = require("../middleware");
const controller = require("../controllers/verifier.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // Fetch all pending listings assigned to the verifier
    app.get(
        "/api/verifiers/listings",
        [authJwt.verifyToken, authJwt.isVerifier],
        controller.getPendingListings
    );

    // Approve a listing proposal
    app.post(
        "/api/verifiers/listings/:id/approve",
        [authJwt.verifyToken, authJwt.isVerifier],
        controller.approveListing
    );

    // Reject a listing proposal
    app.post(
        "/api/verifiers/listings/:id/reject",
        [authJwt.verifyToken, authJwt.isVerifier],
        controller.rejectListing
    );

    // Fetch all listings assigned to the verifier
    app.get(
        "/api/verifiers/listings/all",
        [authJwt.verifyToken, authJwt.isVerifier],
        controller.getAllListingsForVerifier
    );

    app.get(
        "/api/verifiers/listing/:id",
        [authJwt.verifyToken, authJwt.isVerifier],
        controller.getVerifierListing
    );


};
