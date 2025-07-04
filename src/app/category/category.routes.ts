import { Router } from "express";
import {
  create,
  allCategoriesForSubCatAddPage,
  allCategoriesForAdminCatIndexPage,
  update,
  singleCategoryForCategoryEditPage,
  allCategoryForProductAddPage,
  allCategoryForFiltering,
  getAllCategoriesForCatMainPage,
  singleForEditPage,
  getAllCatWithSubCat,
  getCatsWritersPublishersForNavbar,
} from "./category.controller";
import { verifyAdminToken } from "../user/middlewares";

const router = Router();

//Admin routes
router.post("/create", verifyAdminToken, create);
router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);
router.get(
  "/allCategoriesForSubCatAddPage",

  allCategoriesForSubCatAddPage
);
router.get("/getAllCatWithSubCat", getAllCatWithSubCat);
router.get(
  "/allCategoriesForAdminCatIndexPage",
  allCategoriesForAdminCatIndexPage
);

router.get("/allCategoryForProductAddPage", allCategoryForProductAddPage);

router.get(
  "/singleCategoryForCategoryEditPage/:id",
  singleCategoryForCategoryEditPage
);
router.get(
  "/getCatsWritersPublishersForNavbar",
  getCatsWritersPublishersForNavbar
);
router.put("/update/:id", verifyAdminToken, update);

// common routes

router.get("/allCategoryForFiltering", allCategoryForFiltering);

router.get("/getAllCategoriesForCatMainPage", getAllCategoriesForCatMainPage);
export default router;
