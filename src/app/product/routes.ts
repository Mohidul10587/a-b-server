import express from "express";

import {
  create,
  getAllProducts,
  singleForUserFoDetailsPageBySlug,
  getSingleProduct,
  deleteProduct,
  update,
  allForIndexPage,
  getAllProductsForOfferPage,
  getProductsByWriterSlug,
  getProductsByCategorySlug,
  getProductsByPublishersSlug,
  getExistingQuantity,
  singleForEditPage,
  getAllForSeriesAddPage,
  updateStatus,
} from "./controller";

import Product from "./model";
import { getAllSlugsForSitemap } from "../shared/reusableControllers";
import {
  verifyAdminToken,
  verifySellerAndAdminToken,
} from "../user/middlewares";

const router = express.Router();

router.post("/create", verifySellerAndAdminToken, create);
router.get("/singleForEditPage/:id", singleForEditPage);

// // Route for getting all products
router.get("/all", getAllProducts);
router.get("/getExistingQuantity", getExistingQuantity);
// // Route for getting all products
router.get("/allForIndexPage", verifySellerAndAdminToken, allForIndexPage);

router.get("/getAllProductsForOfferPage", getAllProductsForOfferPage);

router.get("/products_by_category_slug/:slug", getProductsByCategorySlug);
router.get("/products_by_punishers_slug/:slug", getProductsByPublishersSlug);
router.get(
  "/getAllForSeriesAddPage",
  verifySellerAndAdminToken,
  getAllForSeriesAddPage
);
router.get("/writer_products_by_slug/:slug", getProductsByWriterSlug);

router.get(
  "/singleForUserFoDetailsPageBySlug/:slug",
  singleForUserFoDetailsPageBySlug
);
// // Route for getting a single product by ID
router.get("/:productId", getSingleProduct);

// // Route for deleting a product by ID
router.delete("/:productId", verifyAdminToken, deleteProduct);

// // Route for updating a product by ID
router.put("/update/:id", verifyAdminToken, update);
router.patch("/updateStatus/:id", verifySellerAndAdminToken, updateStatus);
router.get("/getAllSlugsForSitemap", getAllSlugsForSitemap(Product));
export default router;
