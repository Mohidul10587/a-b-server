"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const product_controller_1 = require("./product.controller");
const admin_middleware_1 = __importDefault(require("../admin_m/admin/admin.middleware"));
// import verifyToken from "../admin/admin.middleware";
const router = express_1.default.Router();
// Multer setup for handling file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png") {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});
const uploadFields = upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "metaImage", maxCount: 1 },
    { name: "attachedFiles", maxCount: 20 },
    { name: "variantSectionsImage", maxCount: 20 },
]);
// Define product-related routes
// Route for getting paginated products
// router.get("/paginatedProducts/:categoryId", getPaginatedProducts);
// Route for creating a new product
router.post("/create", uploadFields, product_controller_1.createProduct);
// // Route for get all product ids
// router.get("/getAllProductIds", getAllProductIds);
// // Define the search route
// router.get("/search", searchProducts);
// // Route for getting all products
router.get("/all", product_controller_1.getAllProducts);
// // Route for getting all products
router.get("/allForAdmin", product_controller_1.getAllProductsForAdmin);
// // Route for getting Last Uploaded Products
// router.get("/lastUploadedProducts", getLastUploadedProducts);
// router.get("/productsForHomePage", getAllProductsForHomePage);
router.get("/getAllProductsForOfferPage", product_controller_1.getAllProductsForOfferPage);
// // Route for getting products by category
// router.get("/category/:categoryId/:notIncludeProductId", getProductsByCategory);
// router.get("/category2/:categoryId", getProductsByCategory2);
// router.get("/products_by_category_slug/:slug", getProductsByCategorySlug);
// router.get("/product_by_subcategory_slug/:slug", getProductsBySubCategorySlug);
// router.get("/subcategory2/:subcategoryId", getProductsBySubCategory2);
// // Route for getting products by writer
// router.get("/writer_products_by_slug/:slug", getProductsByWriterSlug);
// // Route for getting products by writer
// router.get("/writer/:writerId", getProductsByWriter);
// // Route for getting two products by IDs
// router.get("/by-ids/:id1/:id2", getTwoProductsByIds);
// // Route for getting a single product by ID
router.get("/productDetails/:slug", product_controller_1.getProductDetails);
// // Route for getting a single product by ID
router.get("/:productId", product_controller_1.getSingleProduct);
// // Route for deleting a product by ID
router.delete("/:productId", admin_middleware_1.default, product_controller_1.deleteProduct);
// // Route for updating a product by ID
router.put("/update/:productId", admin_middleware_1.default, uploadFields, product_controller_1.updateProduct);
// // Route for updating a product by ID
// router.put(
//   "/updateVariant/:productId",
//   verifyToken,
//   uploadFields,
//   updateProductVariant
// );
// // Additional route for search by title
// router.get("/search/search-by-title", getProductsByTitle);
exports.default = router;
