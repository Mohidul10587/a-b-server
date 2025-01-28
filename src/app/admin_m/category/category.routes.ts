import { Router } from "express";
import {
  createCategory,
  allCategoriesForSubCatAddPage,
  allCategoriesForAdminCatIndexPage,
  update,
  singleCategoryForCategoryEditPage,
  allCategoriesForNavBar,
  allCategoryForProductAddPage,
  allCategoryForFiltering,
} from "./category.controller";
import verifyToken from "../admin/admin.middleware";

const router = Router();

//Admin routes
router.post("/create", verifyToken, createCategory);
router.get(
  "/allCategoriesForSubCatAddPage",

  allCategoriesForSubCatAddPage
);

router.get("/allCategoriesForNavBar", allCategoriesForNavBar);

router.get(
  "/allCategoriesForAdminCatIndexPage",

  allCategoriesForAdminCatIndexPage
);

router.get(
  "/allCategoryForProductAddPage",

  allCategoryForProductAddPage
);

router.get(
  "/singleCategoryForCategoryEditPage/:id",

  singleCategoryForCategoryEditPage
);

router.put("/update/:id", verifyToken, update);

// common routes

router.get(
  "/allCategoryForFiltering",

  allCategoryForFiltering
);

export default router;
