import express from "express";

import {
  createTransaction,
  getAllTransactions,
  deleteTransaction,
} from "./adminTransaction.controller";

const router = express.Router();

// Route to get all transactions for the authenticated seller
router.get("/", getAllTransactions);

export default router;
