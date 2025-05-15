const controller = require("../controllers/category.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get("/api/categories", controller.getCategories);

    app.post("/api/category/create", controller.createCategory);

    app.post("/api/category/delete", controller.deleteCategory);

    app.post("/api/category/deleteType", controller.deleteCategoryType);
}