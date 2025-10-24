import { Router } from "express";

import {
  create,
  getAllBrands,
  getWriterBySlug,
  getWriteById,
  singleForEditPage,
  update,
  getAllForPageBuilder,

  // getAllBrandIds,
} from "./writer.controller";

import { verifyAdminToken } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Writer from "./writer.model";

const router = Router();

router.post("/create", verifyAdminToken, create);
// Route to get all writer IDs
router.get(
  "/singleForEditPage/:id",

  singleForEditPage
);

router.put("/update/:id", verifyAdminToken, update);

router.get("/all", getAllBrands);

router.get("/singleWriterBySlug/:slug", getWriterBySlug);

router.get("/singleWriter/:id", getWriteById);
router.get("/getAllForPageBuilder", getAllForPageBuilder);
router.delete("/delete/:id", verifyAdminToken, deleteById(Writer));

export default router;
