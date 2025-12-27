import express from "express";

import {
  getAllOrders,
  updateStatusBySeller,
  getAllOrdersForAdmin,
  getOrderById,
  //   updateOrderStatus,
  updateOrderStatusByAdmin,
} from "./sellerOrder.controller";
import {
  verAdminTkn,
  verifySellerAndAdminToken,
  verifySellerToken,
} from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import { SellerOrderModel } from "./sellerOrder.model";

const router = express.Router();

router.get("/getAllOrders", verifySellerAndAdminToken, getAllOrders);
router.get("/allOrdersForAdmin", verAdminTkn, getAllOrdersForAdmin);

router.post("/updateStatusByAdmin/:id", updateOrderStatusByAdmin);
router.post("/updateStatusBySeller/:id", updateStatusBySeller);

router.get("/getSingleOrder/:id", getOrderById);
router.delete("/delete/:id", verAdminTkn, deleteById(SellerOrderModel));
export default router;
