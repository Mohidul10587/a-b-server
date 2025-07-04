import { Router } from "express";

import {
  createPageElement,
  getElementById,
  deletePageElementById,
  getElementsByIdAndPage,
  updatePageElementStatus,
  updatePageElement,
  getElementByIdForUpdate,
} from "./element.controller"; // Your controller function

import { verifyAdminToken } from "../user/middlewares";

const router = Router();

// Route to handle form submission and image upload
router.post(
  "/create-page-element",
  verifyAdminToken,

  createPageElement
);

router.get("/elementByIdAndPage/:id/:pageName", getElementsByIdAndPage);

// Get PageElement by ID
router.get("/singleElement/:id", getElementById);
router.get("/singleElementForUpdate/:id", getElementByIdForUpdate);

// Get all PageElements by page property
router.patch("/updateStatus/:id", verifyAdminToken, updatePageElementStatus);

// Delete a single PageElement by ID
router.delete("/delete/:id", verifyAdminToken, deletePageElementById);

// PUT route for updating page elements
router.put(
  "/updateElement/:elementId",
  verifyAdminToken,

  updatePageElement
);

export default router;
