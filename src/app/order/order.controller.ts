// controllers/orderController.ts
import { Request, Response } from "express";
import Order from "./order.model";
import mongoose from "mongoose";
import Cart from "../cart/cart.model";

export const createOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const orderInfo = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    // 1. Create the new order
    const newOrder = await Order.create([orderInfo], { session });

    // 2. Clear the user's cart
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { cartItems: [] } },
      { session }
    );

    // 3. Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Order transaction error:", error);

    res.status(500).json({
      message: "Failed to place order.",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .select(
        "deliveryInfo.name deliveryInfo.address paymentStatus paymentMethod deliveryInfo.phone status"
      )
      .populate({
        path: "cart.id",
        model: "Product",
        select: "title  photo  -_id",
      });
    const updatedOrders = orders.map((order) => ({
      customersName: order.deliveryInfo.name,
      address: order.deliveryInfo.address,
      phone: order.deliveryInfo.phone,
      paymentStatus: order.paymentStatus ? "Paid" : "Unpaid",
      paymentMethod: order.paymentMethod,
      _id: order._id,
      firstProduct: order.cart[0].id,
      status: order.status,
    }));

    res.status(200).json({ orders: updatedOrders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully!", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status.", error });
  }
};
export const getSingleOrders = async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id }).populate({
      path: "cart.id",
      model: "Product",
      select: "title  photo price -_id",
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order.", error });
  }
};
