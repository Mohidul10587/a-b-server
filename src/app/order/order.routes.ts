// routes/orderRoutes.ts
import express from "express";
import {
  create,
  allForAdmin,
  getSingleOrders,
  updateOrderStatus,
} from "./order.controller";
import { verifyUserToken } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Order from "./order.model";

const router = express.Router();

// Create a new order
router.post("/create", verifyUserToken, create);

// Get all orders
router.get("/allForAdmin", allForAdmin);
router.get("/getSingleOrder/:id", getSingleOrders);

// Update order status
router.patch("/updateOrderStatus/:id", updateOrderStatus);
router.delete("/delete/:id", deleteById(Order));

export default router;
