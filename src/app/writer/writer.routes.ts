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

import { verAdminTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Writer from "./writer.model";

const router = Router();

router.post("/create", verAdminTkn, create);
// Route to get all writer IDs
router.get(
  "/singleForEditPage/:id",

  singleForEditPage
);

router.put("/update/:id", verAdminTkn, update);

router.get("/all", getAllBrands);

router.get("/singleWriterBySlug/:slug", getWriterBySlug);

router.get("/singleWriter/:id", getWriteById);
router.get("/getAllForPageBuilder", getAllForPageBuilder);
router.delete("/delete/:id", verAdminTkn, deleteById(Writer));

export default router;
