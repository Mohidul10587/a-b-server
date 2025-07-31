import { Request, Response } from "express";
import Transaction from "./transaction.model";

// Create a new transaction
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, date } = req.body;
    const sellerId = req.user?._id; // Access seller ID from middleware

    const newTransaction = await Transaction.create({
      sellerId,
      orderId,
      amount,
      date,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

// Get all transactions for the authenticated seller
export const getSellerTransactions = async (req: Request, res: Response) => {
  try {
    const sellerId = req.user?._id; // Access seller ID from middleware

    const transactions = await Transaction.find({ sellerId });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Delete a transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const sellerId = req.user?._id; // Access seller ID from middleware

    const transaction = await Transaction.findOne({ _id: id, sellerId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // await transaction.remove();

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};
