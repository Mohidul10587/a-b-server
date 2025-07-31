// controllers/withdrawRequest.controller.ts
import { Request, Response } from "express";
import WithdrawRequest from "./withdraw.model";
import Transaction from "../transaction/transaction.model";
import AdminTransaction from "../adminTransaction/adminTransaction.model";

// Create a new withdraw request

export const createWithdrawRequest = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const sellerId = req.user?._id; // Access seller ID from middleware
    const dataWithSellerId = { ...data, sellerId };
    const newWithdrawRequest = await WithdrawRequest.create(dataWithSellerId);

    res.status(201).json({
      message: "Withdraw request created successfully",
      withdrawRequest: newWithdrawRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating withdraw request", error });
  }
};

// Get all withdraw requests for a seller
export const getWithdrawRequestsForAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const sellerId = req.user?._id; // Access seller ID from middleware
    const withdrawRequests = await WithdrawRequest.find().populate({
      path: "sellerId", // Populate sellerId field in WithdrawRequest
      model: "User", // From the User model
      populate: {
        path: "sellerId", // Populate sellerId field in the populated User
        model: "Seller", // From the Seller model
        select: "companyName email photo",
      },
    });

    res.status(200).json({
      message: "Withdraw requests fetched successfully",
      withdrawRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching withdraw requests", error });
  }
};

// Get all withdraw requests for a seller
export const getWithdrawRequests = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?._id; // Access seller ID from middleware
    const withdrawRequests = await WithdrawRequest.find({ sellerId });

    res.status(200).json({
      message: "Withdraw requests fetched successfully",
      withdrawRequests,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching withdraw requests", error });
  }
};

// Get a specific withdraw request by ID
export const getWithdrawRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const withdrawRequest = await WithdrawRequest.findById(id);

    if (!withdrawRequest) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }

    res.status(200).json({
      message: "Withdraw request fetched successfully",
      withdrawRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching withdraw request", error });
  }
};

// Update a withdraw request
export const updateWithdrawRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedWithdrawRequest = await WithdrawRequest.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );
    if (!updatedWithdrawRequest) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }

    res.status(200).json({
      message: "Withdraw request updated successfully",
      withdrawRequest: updatedWithdrawRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating withdraw request", error });
  }
};

// Delete a withdraw request
export const deleteWithdrawRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedWithdrawRequest = await WithdrawRequest.findByIdAndDelete(id);

    if (!deletedWithdrawRequest) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }

    res.status(200).json({
      message: "Withdraw request deleted successfully",
      withdrawRequest: deletedWithdrawRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting withdraw request", error });
  }
};

// Update withdraw request status
export const updateStatus = async (req: Request, res: Response) => {
  const { withdrawId } = req.params;
  const { withdrawStatus } = req.body;

  // Validate the status
  if (!["Pending", "Rejected", "Approved"].includes(withdrawStatus)) {
    return res.status(400).json({ message: "Invalid status provided" });
  }

  try {
    // Find the withdraw request by ID and update the status
    const updatedWithdraw = await WithdrawRequest.findByIdAndUpdate(
      withdrawId,
      { withdrawStatus },
      { new: true }
    ).populate({
      path: "sellerId", // Populate sellerId field in WithdrawRequest
      model: "User", // From the User model
      select: "_id",
    });

    if (!updatedWithdraw) {
      return res.status(404).json({ message: "Withdraw request not found" });
    }

    const lastTnxOfAdmin = await AdminTransaction.findOne().sort({
      _id: -1,
    });

    if (updatedWithdraw.withdrawStatus === "Approved") {
      const lastTransaction = await Transaction.findOne({
        sellerId: updatedWithdraw.sellerId?._id,
      }).sort({ _id: -1 });

      await Transaction.create({
        sellerId: lastTransaction?.sellerId,
        userId: lastTransaction?.userId,
        orderId: lastTransaction?.orderId,
        recentAmount: lastTransaction?.currentTotal ?? 0,
        previousAmount: lastTransaction?.currentTotal ?? 0,
        currentTotal: 0,
        reasonOfTransaction: "Withdraw",
      });

      await AdminTransaction.create({
        sellerId: updatedWithdraw.sellerId,
        recentAmount: updatedWithdraw.amount,
        previousAmount: lastTnxOfAdmin?.currentTotal ?? 0,
        currentTotal:
          (lastTnxOfAdmin?.currentTotal ?? 0) - updatedWithdraw.amount,
        reasonOfTransaction: "Pay to seller",
      });
    }

    // Return the updated withdraw request
    return res.status(200).json(updatedWithdraw);
  } catch (error) {
    console.error("Error updating withdraw status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
