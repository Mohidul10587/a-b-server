import { Request, Response } from "express";
import Order from "./order.model";

// Submit a new order
export const submitOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orderData = req.body;
    orderData.status = "Pending";

    // Create the order
    const order = await Order.create(orderData);

    // Populate product details after the order is created
    const populatedOrder = await order.populate({
      path: "products",
      select: "title  price stockStatus photo", // Specify the fields you want to include
    });

    res
      .status(201)
      .json({ message: "Order submitted successfully", order: populatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find().populate({
      path: "products",
      select: "photo  price",
    });
    res.status(200).json(orders.reverse());
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders", error });
  }
};

// Get a single order by ID
export const getSingleOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "products",
      select: "_id title photo price stockStatus", // Select only the fields you need from the product
    });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order", error });
  }
};

// Update an order by ID
export const updateOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

// Delete an order by ID
export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};
