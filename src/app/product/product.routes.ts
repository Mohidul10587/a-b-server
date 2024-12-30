import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  getAllProducts,
  getProductDetails,
  getSingleProduct,
  deleteProduct,
  // getProductsByCategory,
  // getTwoProductsByIds,
  // searchProducts,
  updateProduct,
  // getProductsByWriter,
  // getProductsByCategory2,
  // getProductsByTitle,
  // getPaginatedProducts,
  // getAllProductsForHomePage,
  // getLastUploadedProducts,
  // getAllProductIds,
  // getProductsBySubCategory2,
  // getProductsBySubCategorySlug,
  getAllProductsForAdmin,
  getAllProductsForOfferPage,
  // updateProductVariant,
  // getProductsByWriterSlug,
  getProductsByCategorySlug,
} from "./product.controller";
import verifyToken from "../admin_m/admin/admin.middleware";
// import verifyToken from "../admin/admin.middleware";

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png"
    ) {
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
router.post("/create", uploadFields, createProduct);

// // Route for get all product ids
// router.get("/getAllProductIds", getAllProductIds);

// // Define the search route
// router.get("/search", searchProducts);

// // Route for getting all products
router.get("/all", getAllProducts);

// // Route for getting all products
router.get("/allForAdmin", getAllProductsForAdmin);

// // Route for getting Last Uploaded Products
// router.get("/lastUploadedProducts", getLastUploadedProducts);

// router.get("/productsForHomePage", getAllProductsForHomePage);
router.get("/getAllProductsForOfferPage", getAllProductsForOfferPage);
// // Route for getting products by category
// router.get("/category/:categoryId/:notIncludeProductId", getProductsByCategory);

// router.get("/category2/:categoryId", getProductsByCategory2);
router.get("/products_by_category_slug/:slug", getProductsByCategorySlug);

// router.get("/product_by_subcategory_slug/:slug", getProductsBySubCategorySlug);

// router.get("/subcategory2/:subcategoryId", getProductsBySubCategory2);

// // Route for getting products by writer
// router.get("/writer_products_by_slug/:slug", getProductsByWriterSlug);
// // Route for getting products by writer
// router.get("/writer/:writerId", getProductsByWriter);

// // Route for getting two products by IDs
// router.get("/by-ids/:id1/:id2", getTwoProductsByIds);

// // Route for getting a single product by ID
router.get("/productDetails/:slug", getProductDetails);
// // Route for getting a single product by ID
router.get("/:productId", getSingleProduct);

// // Route for deleting a product by ID
router.delete("/:productId", verifyToken, deleteProduct);

// // Route for updating a product by ID
router.put("/update/:productId", verifyToken, uploadFields, updateProduct);
// // Route for updating a product by ID
// router.put(
//   "/updateVariant/:productId",
//   verifyToken,
//   uploadFields,
//   updateProductVariant
// );

// // Additional route for search by title
// router.get("/search/search-by-title", getProductsByTitle);

export default router;
