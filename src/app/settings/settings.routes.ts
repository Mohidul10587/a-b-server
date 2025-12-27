import { Router } from "express";

import {
  // createSettings,
  getSettings,
  getPrivacyPoliciesOfSettings,
  updateDefaultSellerStatus,
  update,
} from "./settings.controller";
import { verAdminTkn } from "../user/middlewares";

const router = Router();

router.get("/", getSettings);
router.get("/getPrivacyPoliciesOfSettings", getPrivacyPoliciesOfSettings);

router.put("/updateSellerDefaultStatus/:id", updateDefaultSellerStatus);

router.put("/update/:id", verAdminTkn, update);

export default router;
