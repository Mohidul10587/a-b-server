import express from "express";

import {
  getAllOrders,
  updateOrderStatusBySeller,
  getAllOrdersForAdmin,
  getOrderById,
  //   updateOrderStatus,
  updateOrderStatusByAdmin,
} from "./sellerOrder.controller";
import { verifyAdminToken, verifySellerToken } from "../user/middlewares";

const router = express.Router();

router.get("/", verifySellerToken, getAllOrders);
router.get("/allOrdersForAdmin", verifyAdminToken, getAllOrdersForAdmin);

router.post("/updateStatusByAdmin/:id", updateOrderStatusByAdmin);
router.post("/updateStatusBySeller/:id", updateOrderStatusBySeller);

router.get("/getSingleOrder/:id", getOrderById);

export default router;
