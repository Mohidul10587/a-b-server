import { Router } from "express";

import multer from "multer";
import {
  createBrand,
  // deleteBrand,
  getAllBrands,
  // getBrandBySlug,
  // getBrandById,
  // getAllBrands2,
  // updateBrand,
  // getAllBrandIds,
} from "./writer.controller";
import path from "path";

const router = Router();

// Multer configuration for file uploads (image validation)
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png"
    ) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// Middleware for handling both single and multiple file uploads
const uploadMiddleware = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "metaImage", maxCount: 1 },
]);

router.post("/create", uploadMiddleware, createBrand);
// Route to get all writer IDs
// router.get("/allBrandIds", getAllBrandIds);
router.get("/all", getAllBrands);

// router.get("/singleBrandBySlug/:slug", getBrandBySlug);

// router.get("/singleBrand/:id", getBrandById);
// router.get("/all2", getAllBrands2);

// router.put("/updateBrand/:id", verifyToken, uploadMiddleware, updateBrand);
// router.delete("/deleteBrand/:id", verifyToken, deleteBrand);

export default router;
