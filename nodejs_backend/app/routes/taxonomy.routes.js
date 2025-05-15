const { authJwt } = require("../middleware");
const controller = require("../controllers/taxonomy.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get(
      "/api/taxonomy",
      controller.getTaxonomy
    );

    app.get("/api/constraints",
      controller.getConstraints
    )

    // app.get(
    //   "/api/constraintsValue",
    //   controller.getConstraintsValue
    // );

    app.get(
      "/api/properties",
      controller.getProperties
    );

    app.post(
      "/api/property/create/:property/:company",
      controller.createProperty
    );

    app.delete("/api/property/:property/:company", controller.deleteProperty)


    app.post("/api/properties/delete", controller.deleteProperties)


  };