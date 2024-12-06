import express from "express";
import multer from "multer";
import path from "path";
import {
  createBanner,
  getAllBanners,
  getBannerById,
  deleteBannerById,
  updateBannerById,
} from "./banner.controller";
import verifyToken from "../admin/admin.middleware";

const router = express.Router();

const storage = multer.memoryStorage();
export const upload_c = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".webp" && ext !== ".png") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

const uploadFields = upload_c.fields([{ name: "bannerImages", maxCount: 20 }]);

router.post("/create", verifyToken, uploadFields, createBanner);
router.get("/all", getAllBanners);
router.get("/singleBanner/:id", getBannerById);
router.delete("/:id", deleteBannerById);
router.put("/update/:id", uploadFields, updateBannerById);

export default router;
