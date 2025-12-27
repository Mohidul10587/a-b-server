// routes/orderRoutes.ts
import express from "express";
import {
  create,
  latestPendingOrdersForAdminWithCounts,
  getSingleOrders,
  updateOrderStatus,
  allDeliveredOrderForAdmin,
  allPendingOrderForAdmin,
  allCancelledOrderForAdmin,
  allOrderForAdmin,
} from "./order.controller";
import { verUserTkn } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import Order from "./order.model";

const router = express.Router();

// Create a new order
router.post("/create", create);

// Get all orders
router.get(
  "/latestPendingOrdersForAdminWithCounts",
  latestPendingOrdersForAdminWithCounts
);
router.get("/allDeliveredOrderForAdmin", allDeliveredOrderForAdmin);
router.get("/allCancelledOrderForAdmin", allCancelledOrderForAdmin);
router.get("/allPendingOrderForAdmin", allPendingOrderForAdmin);
router.get("/allOrderForAdmin", allOrderForAdmin);

router.get("/getSingleOrder/:id", getSingleOrders);

// Update order status
router.patch("/updateOrderStatus/:id", updateOrderStatus);
router.delete("/delete/:id", deleteById(Order));

export default router;
