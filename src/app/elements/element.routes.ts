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

import { verAdminTkn } from "../user/middlewares";

const router = Router();

// Route to handle form submission and image upload
router.post("/create", verAdminTkn, create);
router.get(
  "/allForIndexPageByTargetedPageAndId",
  verAdminTkn,
  allForIndexPageByTargetedPageAndId
);
router.get("/elementById/:id", elementById);

// Get PageElement by ID
router.get("/singleElement/:id", getElementById);
router.get("/singleForEditPage/:id", singleForEditPage);

// Get all PageElements by page property
router.patch("/updateStatus/:id", verAdminTkn, updatePageElementStatus);

// Delete a single PageElement by ID
router.delete("/delete/:id", verAdminTkn, deletePageElementById);

// PUT route for updating page elements
router.put("/update/:id", verAdminTkn, update);

export default router;
