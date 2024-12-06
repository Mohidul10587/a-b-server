import { Router } from "express";
import {
  submitOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
} from "./order.controller";

const router = Router();

router.post("/submit", submitOrder);
router.get("/all", getAllOrders);
router.get("/getSingleOrder/:id", getSingleOrder);
router.put("/updateOrder/:id", updateOrder);
router.put("/updateOrderStatus/:id", updateOrderStatus);
router.delete("/delete/:id", deleteOrder);

export default router;
