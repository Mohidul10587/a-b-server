import express from "express";
import {
  createWithdrawRequest,
  getWithdrawRequestsForAdmin,
  updateStatus,
} from "./withdraw.controller";
import { verifySellerToken } from "../user/middlewares";

const router = express.Router();

// Routes
router.post("/request", verifySellerToken, createWithdrawRequest); // Create a transaction
router.get(
  "/getWithdrawRequestsForAdmin",
  //   verifyToken,
  getWithdrawRequestsForAdmin
); // Create a transaction
// Route to update withdrawal status
router.put("/updateStatus/:withdrawId", updateStatus);
export default router;
