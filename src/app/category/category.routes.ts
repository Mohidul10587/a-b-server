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
  getAllCategoryForFilterPage,
  getAllForPageBuilder,
} from "./category.controller";
import { verAdminTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Category from "./category.model";

const router = Router();

//Admin routes
router.post("/create", verAdminTkn, create);
router.get("/singleForEditPage/:id", verAdminTkn, singleForEditPage);
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
router.put("/update/:id", verAdminTkn, update);

// common routes

router.get("/allCategoryForFiltering", allCategoryForFiltering);

router.get("/getAllCategoriesForCatMainPage", getAllCategoriesForCatMainPage);

router.get("/getAllCategoryForFilterPage", getAllCategoryForFilterPage);
router.get("/getAllForPageBuilder", getAllForPageBuilder);
router.delete("/delete/:id", verAdminTkn, deleteById(Category));
export default router;
