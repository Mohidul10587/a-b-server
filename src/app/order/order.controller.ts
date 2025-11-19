// controllers/orderController.ts
import { Request, Response } from "express";

import mongoose from "mongoose";
import Cart from "../cart/cart.model";
import Category from "../category/category.model";
import Writer from "../writer/writer.model";
import Product from "../product/model";
import Order from "../order/order.model";
import User from "../user/user.model";
import { SellerOrderModel } from "../ordersOFSeller/sellerOrder.model";
export const create = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const orderInfo = req.body;
    console.log("This is order info", orderInfo);
    const userId = orderInfo.user;

    // 1. Create the new order
    const newOrder = await Order.create([orderInfo], { session });
    const sellerOrdersMap = new Map();

    orderInfo.cart.forEach((product: any) => {
      const sellerId = product.seller.toString();
      if (!sellerOrdersMap.has(sellerId)) {
        sellerOrdersMap.set(sellerId, {
          sellerId: sellerId,
          products: [],
          name: orderInfo.deliveryInfo.name,
          address: orderInfo.deliveryInfo.address,
          location: orderInfo.deliveryInfo.address,
          phone: orderInfo.deliveryInfo.phone,
          receiverName: orderInfo.deliveryInfo.receiverName,
          receiverPhone: orderInfo.deliveryInfo.receiverPhone,
          deliveryType: orderInfo.deliveryInfo.deliveryType,
          district: orderInfo.deliveryInfo.district,
          thana: orderInfo.deliveryInfo.thana,
          village: orderInfo.deliveryInfo.village,
          postOffice: orderInfo.deliveryInfo.postOffice,
          postalCode: orderInfo.deliveryInfo.postalCode,
          courierAddress: orderInfo.deliveryInfo.courierAddress,
          status: orderInfo.status,
          userId: orderInfo.user || null,
          paymentMethod: orderInfo.paymentMethod,
          shippingMethod: orderInfo.shippingMethod || "Cache on delivery",
          transactionId: orderInfo.paymentTnxId || "Cache on delivery",
          totalAmount: 0,
        });
      }

      // Add product to the respective seller order
      const sellerOrder = sellerOrdersMap.get(sellerId);
      sellerOrder.products.push({
        ...product,
        commissionForSeller: 90,
        transactionId: orderInfo.paymentTnxId,
        userId: orderInfo.userId || null,
      });
      sellerOrder.totalAmount += product.sellingPrice * product.quantity;
    });

    // Convert map values to array
    const sellerOrders = Array.from(sellerOrdersMap.values());

    await SellerOrderModel.insertMany(sellerOrders, { session });
    // 3. Clear the user's cart
    if (userId) {
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { cartItems: [] } },
        { session }
      );
    }

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

const fetchOrders = async (
  status: string | null,
  page: number,
  limit: number,
  sortBy: "createdAt" | "updatedAt"
) => {
  const query: any = {};
  if (status) query.status = status;

  const orders = await Order.find(query)
    .select(
      "deliveryInfo.name deliveryInfo.address deliveryInfo.phone paymentStatus paymentMethod status cart"
    )
    .sort({ [sortBy]: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const totalOrders = await Order.countDocuments(query);

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

  return { updatedOrders, totalOrders };
};

// Get pending orders
export const allPendingOrderForAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { updatedOrders, totalOrders } = await fetchOrders(
      "Pending",
      page,
      limit,
      "createdAt"
    );

    res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending orders.", error });
  }
};

// Get all orders (with counts)
export const allForAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { updatedOrders, totalOrders } = await fetchOrders(
      null,
      page,
      limit,
      "createdAt"
    );

    const [
      categoriesCount,
      writersCount,
      ordersCount,
      productsCount,
      sellersCount,
      usersCount,
    ] = await Promise.all([
      Category.countDocuments(),
      Writer.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "seller" }),
      User.countDocuments(),
    ]);

    res.status(200).json({
      orders: updatedOrders,
      totalOrders,
      page,
      limit,
      counts: {
        categoriesCount,
        writersCount,
        ordersCount,
        productsCount,
        sellersCount,
        usersCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders.", error });
  }
};

// Get delivered orders
export const allDeliveredOrderForAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { updatedOrders, totalOrders } = await fetchOrders(
      "Delivered",
      page,
      limit,
      "updatedAt"
    );

    res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch delivered orders.", error });
  }
};

// Get cancelled orders
export const allCancelledOrderForAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { updatedOrders, totalOrders } = await fetchOrders(
      "Cancelled",
      page,
      limit,
      "updatedAt"
    );

    res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cancelled orders.", error });
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
    res.status(500).json({ message: "Failed to fetch order.", error });
  }
};
