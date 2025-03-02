"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const admin_middleware_1 = __importDefault(require("../admin_m/admin/admin.middleware"));
const router = express_1.default.Router();
router.post("/create", product_controller_1.create);
// // Route for getting all products
router.get("/all", product_controller_1.getAllProducts);
// // Route for getting all products
router.get("/allForAdmin", product_controller_1.getAllProductsForAdmin);
router.get("/getAllProductsForOfferPage", product_controller_1.getAllProductsForOfferPage);
router.get("/products_by_category_slug/:slug", product_controller_1.getProductsByCategorySlug);
router.get("/products_by_punishers_slug/:slug", product_controller_1.getProductsByPublishersSlug);
router.get("/writer_products_by_slug/:slug", product_controller_1.getProductsByWriterSlug);
router.get("/productDetails/:slug", product_controller_1.getProductDetails);
// // Route for getting a single product by ID
router.get("/:productId", product_controller_1.getSingleProduct);
// // Route for deleting a product by ID
router.delete("/:productId", admin_middleware_1.default, product_controller_1.deleteProduct);
// // Route for updating a product by ID
router.put("/update/:productId", admin_middleware_1.default, product_controller_1.update);
exports.default = router;
