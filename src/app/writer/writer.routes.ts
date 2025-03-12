import { Router } from "express";

import {
  create,
  getAllBrands,
  getWriterBySlug,
  getWriteById,
  singleWriterForWriterEditPage,
  update,

  // getAllBrandIds,
} from "./writer.controller";

import verifyToken from "../admin/admin.middleware";

const router = Router();

router.post("/create", verifyToken, create);
// Route to get all writer IDs
router.get(
  "/singleWriterForWriterEditPage/:id",

  singleWriterForWriterEditPage
);

router.put("/update/:id", verifyToken, update);

router.get("/all", getAllBrands);

router.get("/singleWriterBySlug/:slug", getWriterBySlug);

router.get("/singleWriter/:id", getWriteById);

export default router;
