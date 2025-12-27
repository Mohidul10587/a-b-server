import express from "express";
import {
  createTransaction,
  getSellerTransactions,
  deleteTransaction,
} from "./transaction.controller";
import { verifySellerToken, verUserTkn } from "../user/middlewares";

const router = express.Router();

// Route to create a new transaction
router.post("/", verUserTkn, createTransaction);

// Route to get all transactions for the authenticated seller
router.get(
  "/getAllSellerTransaction",
  verifySellerToken,
  getSellerTransactions
);

// Route to delete a transaction
router.delete("/:id", verUserTkn, deleteTransaction);

export default router;
