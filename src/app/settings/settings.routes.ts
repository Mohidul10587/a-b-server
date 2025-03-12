import { Router } from "express";

import {
  // createSettings,
  getSettings,
  updateSettings,
  getPrivacyPoliciesOfSettings,
  updateDefaultSellerStatus,
} from "./settings.controller";
import verifyToken from "../admin/admin.middleware";
import upload from "../shared/multer";

const router = Router();

router.get("/", getSettings);
router.get("/getPrivacyPoliciesOfSettings", getPrivacyPoliciesOfSettings);

router.put("/updateSellerDefaultStatus/:id", updateDefaultSellerStatus);

router.put(
  "/update",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "loto", maxCount: 1 },
    { name: "fbImage", maxCount: 1 },
  ]),
  updateSettings
);

export default router;
