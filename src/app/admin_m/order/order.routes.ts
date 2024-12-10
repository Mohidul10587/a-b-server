// routes/orderRoutes.ts
import express from "express";
import {
  createOrder,
  getOrders,
  getSingleOrders,
  updateOrderStatus,
} from "./order.controller";

const router = express.Router();

// Create a new order
router.post("/create", createOrder);

// Get all orders
router.get("/all", getOrders);
router.get("/getSingleOrder/:id", getSingleOrders);

// Update order status
router.patch("/orders/:id", updateOrderStatus);

export default router;
