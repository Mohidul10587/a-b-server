// routes/orderRoutes.ts
import express from "express";
import {
  create,
  allForAdmin,
  getSingleOrders,
  updateOrderStatus,
  allDeliveredOrderForAdmin,
  allPendingOrderForAdmin,
  allCancelledOrderForAdmin,
} from "./order.controller";
import { verifyUserToken } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Order from "./order.model";

const router = express.Router();

// Create a new order
router.post("/create", create);

// Get all orders
router.get("/allForAdmin", allForAdmin);
router.get("/allDeliveredOrderForAdmin", allDeliveredOrderForAdmin);
router.get("/allCancelledOrderForAdmin", allCancelledOrderForAdmin);
router.get("/allPendingOrderForAdmin", allPendingOrderForAdmin);

router.get("/getSingleOrder/:id", getSingleOrders);

// Update order status
router.patch("/updateOrderStatus/:id", updateOrderStatus);
router.delete("/delete/:id", deleteById(Order));

export default router;
