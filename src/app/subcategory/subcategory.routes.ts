import { Router } from "express";
import {
  allSubcategoriesForAdminSubCatIndexPage,
  allSubcategoriesForChildCatAddPage,
  createSubcategory,
  singleSubcategoryForSubcategoryEditPage,
  update,
} from "./subcategory.controller";

const router = Router();

// Route to create a new category
router.post("/create", createSubcategory);
router.get(
  "/allSubcategoriesForChildCatAddPage",

  allSubcategoriesForChildCatAddPage
);
router.get(
  "/allSubcategoriesForAdminSubCatIndexPage",

  allSubcategoriesForAdminSubCatIndexPage
);
router.get(
  "/singleSubcategoryForSubcategoryEditPage/:id",

  singleSubcategoryForSubcategoryEditPage
);
router.put("/update/:id", update);

export default router;
