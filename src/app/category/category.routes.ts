import { Router } from "express";
import {
  create,
  allCategoriesForSubCatAddPage,
  allCategoriesForAdminCatIndexPage,
  update,
  singleCategoryForCategoryEditPage,
  allCategoriesForNavBar,
  allCategoryForProductAddPage,
  allCategoryForFiltering,
  getAllCategoriesForCatMainPage,
} from "./category.controller";
import { verifyAdminToken } from "../user/middlewares";

const router = Router();

//Admin routes
router.post("/create", verifyAdminToken, create);
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

router.put("/update/:id", verifyAdminToken, update);

// common routes

router.get(
  "/allCategoryForFiltering",

  allCategoryForFiltering
);

router.get(
  "/getAllCategoriesForCatMainPage",

  getAllCategoriesForCatMainPage
);
export default router;
