import express from "express";

import {
  create,
  getAllBanners,
  getBannerById,
  deleteBannerById,
  update,
  singleForEditPage,
  allForAdminIndexPage,
} from "./banner.controller";
import { verifyAdminToken } from "../user/middlewares";

const router = express.Router();

router.post("/create", verifyAdminToken, create);
router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);
router.put("/update/:id", verifyAdminToken, update);
router.get("/allForAdminIndexPage", allForAdminIndexPage);

router.get("/singleBanner/:id", getBannerById);
router.delete("/:id", deleteBannerById);
router.get("/all", getAllBanners);

export default router;
