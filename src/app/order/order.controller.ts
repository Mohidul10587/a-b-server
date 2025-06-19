// controllers/orderController.ts
import { Request, Response } from "express";

import mongoose from "mongoose";
import Cart from "../cart/cart.model";
import Category from "../category/category.model";
import Writer from "../writer/writer.model";
import Product from "../product/product.model";
import Order from "../order/order.model";
import Publisher from "../publishers/publishers.model";
import { count } from "console";
import User from "../user/user.model";
export const create = async (req: Request, res: Response) => {
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
export const allForAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .select(
        "deliveryInfo.name deliveryInfo.address paymentStatus paymentMethod deliveryInfo.phone status cart"
      )
      .sort({ createdAt: -1 });

    const updatedOrders = orders.map((order) => ({
      customersName: order.deliveryInfo.name,
      address: order.deliveryInfo.address,
      phone: order.deliveryInfo.phone,
      paymentStatus: order.paymentStatus ? "Paid" : "Unpaid",
      paymentMethod: order.paymentMethod,
      _id: order._id,
      firstProduct: order.cart[0],
      status: order.status,
    }));
    const [
      categoriesCount,
      writersCount,
      ordersCount,
      productsCount,
      publishersCount,
      usersCount,
    ] = await Promise.all([
      Category.countDocuments(),
      Writer.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Publisher.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      orders: updatedOrders,
      counts: {
        categoriesCount,
        writersCount,
        ordersCount,
        productsCount,
        publishersCount,
        usersCount,
      },
    });
  } catch (error) {
    console.log(error);
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
    const order = await Order.findOne({ _id: req.params.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch order.", error });
  }
};
