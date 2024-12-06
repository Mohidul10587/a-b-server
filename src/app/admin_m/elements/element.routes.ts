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
import { upload_c } from "../banner/banner.routes";
import verifyToken from "../admin/admin.middleware";

const router = Router();
const uploadFields = upload_c.fields([{ name: "images", maxCount: 20 }]);
// Route to handle form submission and image upload
router.post(
  "/create-page-element",
  verifyToken,
  uploadFields, // 'images' is the field name for the file inputs, allowing up to 10 files
  createPageElement
);

router.get("/elementByIdAndPage/:id/:pageName", getElementsByIdAndPage);

// Get PageElement by ID
router.get("/singleElement/:id", getElementById);
router.get("/singleElementForUpdate/:id", getElementByIdForUpdate);

// Get all PageElements by page property
router.patch("/updateStatus/:id", verifyToken, updatePageElementStatus);

// Delete a single PageElement by ID
router.delete("/delete/:id", verifyToken, deletePageElementById);

// PUT route for updating page elements
router.put(
  "/updateElement/:elementId",
  verifyToken,
  uploadFields,
  updatePageElement
);

export default router;
