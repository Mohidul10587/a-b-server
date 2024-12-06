// routes/adminRoutes.ts
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  updatePassword,
  checkAdmin,
  getCountsOfDocuments,
  refreshToken,
  updateAdminEmail,
} from "./admin.controller";
import verifyToken from "./admin.middleware";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshToken);
router.put("/update-password", verifyToken, updatePassword);
router.get("/check-admin", verifyToken, checkAdmin); // Adding the checkAdmin route with verifyToken middleware
router.get("/getOrdersCount", getCountsOfDocuments);
router.put("/update-email", verifyToken, updateAdminEmail);

export default router;
