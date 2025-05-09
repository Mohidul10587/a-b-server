import express from "express";

import {
  create,
  getAllProducts,
  singleForUserFoDetailsPageBySlug,
  getSingleProduct,
  deleteProduct,
  update,
  getAllProductsForAdmin,
  getAllProductsForOfferPage,
  getProductsByWriterSlug,
  getProductsByCategorySlug,
  getProductsByPublishersSlug,
  getExistingQuantity,
} from "./product.controller";
import verifyToken from "../admin/admin.middleware";
import Product from "./product.model";
import { getAllSlugsForSitemap } from "../shared/reusableControllers";

const router = express.Router();

router.post("/create", create);

// // Route for getting all products
router.get("/all", getAllProducts);
router.get("/getExistingQuantity", getExistingQuantity);
// // Route for getting all products
router.get("/allForAdmin", getAllProductsForAdmin);

router.get("/getAllProductsForOfferPage", getAllProductsForOfferPage);

router.get("/products_by_category_slug/:slug", getProductsByCategorySlug);
router.get("/products_by_punishers_slug/:slug", getProductsByPublishersSlug);

router.get("/writer_products_by_slug/:slug", getProductsByWriterSlug);

router.get(
  "/singleForUserFoDetailsPageBySlug/:slug",
  singleForUserFoDetailsPageBySlug
);
// // Route for getting a single product by ID
router.get("/:productId", getSingleProduct);

// // Route for deleting a product by ID
router.delete("/:productId", verifyToken, deleteProduct);

// // Route for updating a product by ID
router.put("/update/:productId", verifyToken, update);

router.get("/getAllSlugsForSitemap", getAllSlugsForSitemap(Product));
export default router;
