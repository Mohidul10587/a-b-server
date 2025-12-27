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
import { verAdminTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Banner from "./banner.model";

const router = express.Router();

router.post("/create", verAdminTkn, create);
router.get("/singleForEditPage/:id", verAdminTkn, singleForEditPage);
router.put("/update/:id", verAdminTkn, update);
router.get("/allForAdminIndexPage", allForAdminIndexPage);

router.get("/singleBanner/:id", getBannerById);
router.delete("/:id", deleteBannerById);
router.get("/all", getAllBanners);
router.delete("/delete/:id", verAdminTkn, deleteById(Banner));
export default router;
