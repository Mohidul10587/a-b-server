import express from "express";

import {
  getAllOrders,
  updateStatusBySeller,
  getAllOrdersForAdmin,
  getOrderById,
  //   updateOrderStatus,
  updateOrderStatusByAdmin,
} from "./sellerOrder.controller";
import { verifyAdminToken, verifySellerToken } from "../user/middlewares";

const router = express.Router();

router.get("/getAllOrders", verifySellerToken, getAllOrders);
router.get("/allOrdersForAdmin", verifyAdminToken, getAllOrdersForAdmin);

router.post("/updateStatusByAdmin/:id", updateOrderStatusByAdmin);
router.post("/updateStatusBySeller/:id", updateStatusBySeller);

router.get("/getSingleOrder/:id", getOrderById);

export default router;
