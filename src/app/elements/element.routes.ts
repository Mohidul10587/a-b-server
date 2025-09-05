import { Router } from "express";

import {
  create,
  getElementById,
  deletePageElementById,
  elementById,
  updatePageElementStatus,
  update,
  singleForEditPage,
  allForIndexPageByTargetedPageAndId,
} from "./element.controller"; // Your controller function

import { verifyAdminToken } from "../user/middlewares";

const router = Router();

// Route to handle form submission and image upload
router.post("/create", verifyAdminToken, create);
router.get(
  "/allForIndexPageByTargetedPageAndId",
  verifyAdminToken,
  allForIndexPageByTargetedPageAndId
);
router.get("/elementById/:id", elementById);

// Get PageElement by ID
router.get("/singleElement/:id", getElementById);
router.get("/singleForEditPage/:id", singleForEditPage);

// Get all PageElements by page property
router.patch("/updateStatus/:id", verifyAdminToken, updatePageElementStatus);

// Delete a single PageElement by ID
router.delete("/delete/:id", verifyAdminToken, deletePageElementById);

// PUT route for updating page elements
router.put("/update/:id", verifyAdminToken, update);

export default router;
