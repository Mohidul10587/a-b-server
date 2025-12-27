import { Router } from "express";
import {
  createPublisher,
  deletePublisher,
  getAllPublishers,
  getPublisherBySlug,
  getPublisherById,
  allForIndexPage,
  getAllPublisherIds,
  allForProductUploadPage,
  allPublisherForFiltering,
} from "./publishers.controller";

import { uploadMiddleware } from "../shared/uploadSingleFileToCloudinary";
import { verAdminTkn } from "../user/middlewares";

const router = Router();

router.post("/create", verAdminTkn, uploadMiddleware, createPublisher);
// Route to get all publisher IDs
router.get("/allPublisherIds", getAllPublisherIds);
router.get("/all", getAllPublishers);
router.get("/allForProductUploadPage", allForProductUploadPage);

// router.get("/allForNavbar", getAllPublishersForNavbar);
// router.get("/allForPublisherPage", getAllPublishersForPublisherPage);

router.get("/singlePublisherBySlug/:slug", getPublisherBySlug);

router.get("/singlePublisher/:id", getPublisherById);
router.get("/allForIndexPage", allForIndexPage);

// router.put("/updatePublisher/:id", verAdminTkn, uploadMiddleware, updatePublisher);
router.delete("/:id", verAdminTkn, deletePublisher);

router.get(
  "/allPublisherForFiltering",

  allPublisherForFiltering
);
export default router;
