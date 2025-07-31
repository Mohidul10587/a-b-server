import { Request, Response } from "express";
import { SellerOrderModel } from "./sellerOrder.model"; // Adjust path if needed
import Transaction from "../transaction/transaction.model";
import AdminTransaction from "../adminTransaction/adminTransaction.model";

import mongoose from "mongoose";
import Product from "../product/model";
// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?._id;
    const orders = await SellerOrderModel.find({ sellerId });
    const totalProductsNumber = await Product.find({
      seller: sellerId,
    }).countDocuments();
    // Use aggregation to calculate counts in one query
    const results = await SellerOrderModel.aggregate([
      { $match: { sellerId } }, // Match orders for the specific seller
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count the documents in each group
        },
      },
    ]);
    // Parse results to dynamically extract counts for all statuses
    const counts = results.reduce((acc, item) => {
      acc[item._id] = item.count; // Use status as key and count as value
      return acc;
    }, {} as Record<string, number>); // Initialize an empty object for counts

    // Extract specific statuses or set defaults if they don't exist
    const totalPendingOrder = counts["Pending"] || 0;
    const totalApprovedOrder = counts["Approved"] || 0;
    const totalShippedOrder = counts["Shipped"] || 0;
    const totalCanceledOrder = counts["Cancelled"] || 0;
    const totalDeliveredOrder = counts["Delivered"] || 0;
    // Calculate the total orders
    const totalOrderNumber =
      totalPendingOrder +
      totalApprovedOrder +
      totalShippedOrder +
      totalCanceledOrder +
      totalDeliveredOrder;
    res.status(200).json({
      orders: orders.reverse(),
      totalPendingOrder,
      totalApprovedOrder,
      totalShippedOrder,
      totalCanceledOrder,
      totalDeliveredOrder,
      totalOrderNumber,
      totalProductsNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Get all orders
export const getAllOrdersForAdmin = async (req: Request, res: Response) => {
  try {
    const orders = await SellerOrderModel.find().populate({
      path: "sellerId",
      select: "name image email",
      populate: {
        path: "sellerId",
        select: "companyName photo email",
      },
    });
    const totalProductsNumber = await Product.find().countDocuments();
    // Use aggregation to calculate counts in one query
    const results = await SellerOrderModel.aggregate([
      {
        $group: {
          _id: "$status", // Group by status
          count: { $sum: 1 }, // Count the documents in each group
        },
      },
    ]);
    // Parse results to dynamically extract counts for all statuses
    const counts = results.reduce((acc, item) => {
      acc[item._id] = item.count; // Use status as key and count as value
      return acc;
    }, {} as Record<string, number>); // Initialize an empty object for counts

    // Extract specific statuses or set defaults if they don't exist
    const totalPendingOrder = counts["Pending"] || 0;
    const totalApprovedOrder = counts["Approved"] || 0;
    const totalShippedOrder = counts["Shipped"] || 0;
    const totalCanceledOrder = counts["Cancelled"] || 0;
    const totalDeliveredOrder = counts["Delivered"] || 0;
    // Calculate the total orders
    const totalOrderNumber =
      totalPendingOrder +
      totalApprovedOrder +
      totalShippedOrder +
      totalCanceledOrder +
      totalDeliveredOrder;
    res.status(200).json({
      orders: orders.reverse(),
      totalPendingOrder,
      totalApprovedOrder,
      totalShippedOrder,
      totalCanceledOrder,
      totalDeliveredOrder,
      totalOrderNumber,
      totalProductsNumber,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};
// // Get a single order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await SellerOrderModel.findById({ _id: id }).populate({
      path: "sellerId",
      select: "name image email",
      populate: {
        path: "sellerId",
        select: "companyName photo email",
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

export const updateOrderStatusBySeller = async (
  req: Request,
  res: Response
) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start transaction

  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new Error("Status is required");
    }

    const previousOrder = await SellerOrderModel.findOne({ _id: id }).session(
      session
    );

    if (!previousOrder) {
      throw new Error("Order not found");
    }

    for (const product of previousOrder.products) {
      const existingProduct = await Product.findById(product._id).session(
        session
      );
      if (existingProduct) {
        const newQuantity = Math.max(
          0,
          existingProduct.existingQnt - product.quantity
        );
        await Product.findOneAndUpdate(
          { _id: product._id },
          { $set: { existingQnt: newQuantity } },
          { new: true, session }
        );
      }
    }

    // ✅ Update order status
    const updatedOrder = await SellerOrderModel.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true, session }
    );

    if (!updatedOrder) {
      throw new Error("Order not found after update");
    }

    const totalCommission = updatedOrder.products.reduce(
      (total, product) =>
        total +
        (product.price * product.commissionForSeller * product.quantity) / 100,
      0
    );

    const remainedCommission = updatedOrder.products.reduce(
      (total, product) =>
        total +
        ((100 - product.commissionForSeller) / 100) *
          product.price *
          product.quantity,
      0
    );

    const lastTnxOfAdmin = await AdminTransaction.findOne()
      .sort({ _id: -1 })
      .session(session);
    const lastTnxOfSeller = await Transaction.findOne({
      sellerId: updatedOrder.sellerId,
    })
      .sort({ _id: -1 })
      .session(session);

    if (
      previousOrder.status === "Delivered" &&
      updatedOrder.status === "Cancelled"
    ) {
      await Transaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: totalCommission,
            previousAmount: lastTnxOfSeller?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfSeller?.currentTotal ?? 0) - totalCommission,
            reasonOfTransaction: "Cancel after delivered",
          },
        ],
        { session }
      );

      await AdminTransaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: remainedCommission,
            previousAmount: lastTnxOfAdmin?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfAdmin?.currentTotal ?? 0) - remainedCommission,
            reasonOfTransaction: "Cancel after delivered",
          },
        ],
        { session }
      );
    }

    if (updatedOrder.status === "Delivered") {
      await Transaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: totalCommission,
            previousAmount: lastTnxOfSeller?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfSeller?.currentTotal ?? 0) + totalCommission,
            reasonOfTransaction: "Order delivered",
          },
        ],
        { session }
      );

      await AdminTransaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: remainedCommission,
            previousAmount: lastTnxOfAdmin?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfAdmin?.currentTotal ?? 0) + remainedCommission,
            reasonOfTransaction: "Order delivered",
          },
        ],
        { session }
      );
    }

    await session.commitTransaction(); // ✅ Commit transaction
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    await session.abortTransaction(); // ✅ Ensure transaction rollback
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ message: error.message || "Error updating order status" });
  } finally {
    session.endSession(); // ✅ Always end session
  }
};

// // 'Update status by admin'

export const updateOrderStatusByAdmin = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate that the status is provided
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const previousOrder = await SellerOrderModel.findOne({ _id: id }).session(
      session
    );
    if (!previousOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    for (const product of previousOrder.products) {
      const existingProduct = await Product.findById(product._id).session(
        session
      );
      if (existingProduct) {
        const newQuantity = Math.max(
          0,
          existingProduct.existingQnt - product.quantity
        );
        await Product.findOneAndUpdate(
          { _id: product._id },
          { $set: { existingQnt: newQuantity } },
          { new: true, session }
        );
      }
    }

    // Update the order status
    const updatedOrder = await SellerOrderModel.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true, session }
    );

    if (!updatedOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Order not found" });
    }

    // Calculate commission values
    const totalCommission = updatedOrder.products.reduce((total, product) => {
      const commission = (product.price * product.commissionForSeller) / 100;
      return total + commission;
    }, 0);

    const remainedCommission = updatedOrder.products.reduce(
      (total, product) => {
        const commission =
          ((100 - product.commissionForSeller) / 100) * product.price;
        return total + commission;
      },
      0
    );

    // Get last transactions
    const lastTnxOfAdmin = await AdminTransaction.findOne()
      .sort({ _id: -1 })
      .session(session);
    const lastTnxOfSeller = await Transaction.findOne({
      sellerId: updatedOrder.sellerId,
    })
      .sort({ _id: -1 })
      .session(session);

    if (
      previousOrder.status === "Delivered" &&
      updatedOrder.status === "Cancelled"
    ) {
      await Transaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: totalCommission,
            previousAmount: lastTnxOfSeller?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfSeller?.currentTotal ?? 0) - totalCommission,
            reasonOfTransaction: "Cancel by admin after delivered",
          },
        ],
        { session }
      );

      await AdminTransaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: remainedCommission,
            previousAmount: lastTnxOfAdmin?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfAdmin?.currentTotal ?? 0) - remainedCommission,
            reasonOfTransaction: "Cancel by admin after delivered",
          },
        ],
        { session }
      );
    }

    if (updatedOrder.status === "Delivered") {
      await Transaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: totalCommission,
            previousAmount: lastTnxOfSeller?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfSeller?.currentTotal ?? 0) + totalCommission,
            reasonOfTransaction: "Order delivered by admin",
          },
        ],
        { session }
      );

      await AdminTransaction.create(
        [
          {
            sellerId: updatedOrder.sellerId,
            userId: updatedOrder.userId,
            orderId: updatedOrder._id,
            recentAmount: remainedCommission,
            previousAmount: lastTnxOfAdmin?.currentTotal ?? 0,
            currentTotal:
              (lastTnxOfAdmin?.currentTotal ?? 0) + remainedCommission,
            reasonOfTransaction: "Order delivered by admin",
          },
        ],
        { session }
      );
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json(updatedOrder);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Error updating order status", error });
  }
};

// // Delete an order
// export const deleteOrder = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deletedOrder = await SellerOrderModel.findByIdAndDelete(id);
//     if (!deletedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.status(200).json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting order", error });
//   }
// };
