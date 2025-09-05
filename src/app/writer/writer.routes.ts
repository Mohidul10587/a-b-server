import { Router } from "express";

import {
  create,
  getAllBrands,
  getWriterBySlug,
  getWriteById,
  singleWriterForWriterEditPage,
  update,
  getAllForPageBuilder,

  // getAllBrandIds,
} from "./writer.controller";

import { verifyAdminToken } from "../user/middlewares";

const router = Router();

router.post("/create", verifyAdminToken, create);
// Route to get all writer IDs
router.get(
  "/singleWriterForWriterEditPage/:id",

  singleWriterForWriterEditPage
);

router.put("/update/:id", verifyAdminToken, update);

router.get("/all", getAllBrands);

router.get("/singleWriterBySlug/:slug", getWriterBySlug);

router.get("/singleWriter/:id", getWriteById);
router.get("/getAllForPageBuilder", getAllForPageBuilder);

export default router;
