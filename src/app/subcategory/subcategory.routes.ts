import { Router } from "express";
import {
  allSubcategoriesForAdminSubCatIndexPage,
  create,
  singleForEditPage,
  update,
} from "./subcategory.controller";
import { verifyAdminToken } from "../user/middlewares";
import Subcategory from "./subcategory.model";
import { deleteById } from "../shared/reusableControllers";

const router = Router();

// Route to create a new category
router.post("/create", create);
router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);

router.get(
  "/allSubcategoriesForAdminSubCatIndexPage",

  allSubcategoriesForAdminSubCatIndexPage
);

router.put("/update/:id", update);
router.delete("/delete/:id", verifyAdminToken, deleteById(Subcategory));

export default router;
