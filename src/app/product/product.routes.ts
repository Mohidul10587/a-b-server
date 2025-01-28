import express from "express";

import {
  create,
  getAllProducts,
  getProductDetails,
  getSingleProduct,
  deleteProduct,
  update,
  getAllProductsForAdmin,
  getAllProductsForOfferPage,
  getProductsByWriterSlug,
  getProductsByCategorySlug,
  getProductsByPublishersSlug,
} from "./product.controller";
import verifyToken from "../admin_m/admin/admin.middleware";

const router = express.Router();

router.post("/create", create);

// // Route for getting all products
router.get("/all", getAllProducts);

// // Route for getting all products
router.get("/allForAdmin", getAllProductsForAdmin);

router.get("/getAllProductsForOfferPage", getAllProductsForOfferPage);

router.get("/products_by_category_slug/:slug", getProductsByCategorySlug);
router.get("/products_by_punishers_slug/:slug", getProductsByPublishersSlug);

router.get("/writer_products_by_slug/:slug", getProductsByWriterSlug);

router.get("/productDetails/:slug", getProductDetails);
// // Route for getting a single product by ID
router.get("/:productId", getSingleProduct);

// // Route for deleting a product by ID
router.delete("/:productId", verifyToken, deleteProduct);

// // Route for updating a product by ID
router.put("/update/:productId", verifyToken, update);

export default router;
