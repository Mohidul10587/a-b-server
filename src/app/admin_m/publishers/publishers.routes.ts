import { Router } from "express";

import multer from "multer";
import {
  createPublisher,
  deletePublisher,
  getAllPublishers,
  getPublisherBySlug,
  getPublisherById,
  allForIndexPage,
  // updatePublisher,
  getAllPublisherIds,
  // getAllPublishersForNavbar,
  // getAllPublishersForPublisherPage,
  allForProductUploadPage,
} from "./publishers.controller";

import { uploadMiddleware } from "../../shared/uploadSingleFileToCloudinary";
import verifyToken from "../admin/admin.middleware";

const router = Router();

router.post("/create", verifyToken, uploadMiddleware, createPublisher);
// Route to get all publisher IDs
router.get("/allPublisherIds", getAllPublisherIds);
router.get("/all", getAllPublishers);
router.get("/allForProductUploadPage", allForProductUploadPage);

// router.get("/allForNavbar", getAllPublishersForNavbar);
// router.get("/allForPublisherPage", getAllPublishersForPublisherPage);

router.get("/singlePublisherBySlug/:slug", getPublisherBySlug);

router.get("/singlePublisher/:id", getPublisherById);
router.get("/allForIndexPage", allForIndexPage);

// router.put("/updatePublisher/:id", verifyToken, uploadMiddleware, updatePublisher);
router.delete("/:id", verifyToken, deletePublisher);

export default router;
