// routes/adminRoutes.ts
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  updatePassword,
  checkAdmin,
  getCountsOfDocuments,
  updateAdminEmail,
} from "./admin.controller";
import verifyToken from "./admin.middleware";
import { logOut } from "../shared/logOut";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logOut);
router.put("/update-password", verifyToken, updatePassword);
router.get("/check-admin", verifyToken, checkAdmin); // Adding the checkAdmin route with verifyToken middleware
router.get("/getOrdersCount", getCountsOfDocuments);

export default router;
