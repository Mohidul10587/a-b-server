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
import { deleteById } from "../shared/reusableControllers";
import Banner from "./banner.model";

const router = express.Router();

router.post("/create", verifyAdminToken, create);
router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);
router.put("/update/:id", verifyAdminToken, update);
router.get("/allForAdminIndexPage", allForAdminIndexPage);

router.get("/singleBanner/:id", getBannerById);
router.delete("/:id", deleteBannerById);
router.get("/all", getAllBanners);
router.delete("/delete/:id", verifyAdminToken, deleteById(Banner));
export default router;
