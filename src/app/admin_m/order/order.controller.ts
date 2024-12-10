// controllers/orderController.ts
import { Request, Response } from "express";
import Order from "./order.model";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { cart, deliveryInfo, paymentMethod } = req.body;
    console.log(cart);
    if (!cart || !deliveryInfo || !paymentMethod) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOrder = new Order({
      cart,
      deliveryInfo,
      paymentMethod,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to place order.", error });
  }
};

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .select(
        "deliveryInfo.name deliveryInfo.address deliveryInfo.phone status"
      )
      .populate({
        path: "cart.id",
        model: "Product",
        select: "title  photo  -_id",
      });
    const updatedOrders = orders.map((o) => ({
      customersName: o.deliveryInfo.name,
      address: o.deliveryInfo.address,
      phone: o.deliveryInfo.phone,

      _id: o._id,
      firstProduct: o.cart[0].id,
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
    console.log(req.params.id);
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
