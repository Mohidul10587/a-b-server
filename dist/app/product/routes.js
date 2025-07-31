"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const model_1 = __importDefault(require("./model"));
const reusableControllers_1 = require("../shared/reusableControllers");
const middlewares_1 = require("../user/middlewares");
const router = express_1.default.Router();
router.post("/create", middlewares_1.verifySellerAndAdminToken, controller_1.create);
router.get("/singleForEditPage/:id", controller_1.singleForEditPage);
// // Route for getting all products
router.get("/all", controller_1.getAllProducts);
router.get("/getExistingQuantity", controller_1.getExistingQuantity);
// // Route for getting all products
router.get("/allForIndexPage", middlewares_1.verifySellerAndAdminToken, controller_1.allForIndexPage);
router.get("/getAllProductsForOfferPage", controller_1.getAllProductsForOfferPage);
router.get("/products_by_category_slug/:slug", controller_1.getProductsByCategorySlug);
router.get("/products_by_punishers_slug/:slug", controller_1.getProductsByPublishersSlug);
router.get("/getAllForSeriesAddPage", middlewares_1.verifySellerAndAdminToken, controller_1.getAllForSeriesAddPage);
router.get("/writer_products_by_slug/:slug", controller_1.getProductsByWriterSlug);
router.get("/singleForUserFoDetailsPageBySlug/:slug", controller_1.singleForUserFoDetailsPageBySlug);
// // Route for getting a single product by ID
router.get("/:productId", controller_1.getSingleProduct);
// // Route for deleting a product by ID
router.delete("/:productId", middlewares_1.verifyAdminToken, controller_1.deleteProduct);
// // Route for updating a product by ID
router.put("/update/:id", middlewares_1.verifyAdminToken, controller_1.update);
router.patch("/updateStatus/:id", middlewares_1.verifySellerAndAdminToken, controller_1.updateStatus);
router.get("/getAllSlugsForSitemap", (0, reusableControllers_1.getAllSlugsForSitemap)(model_1.default));
exports.default = router;
