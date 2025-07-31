import { model, Schema, Document, Types } from "mongoose";

// Type definition
export interface Transaction extends Document {
  sellerId: Types.ObjectId | null;
  userId: Types.ObjectId | null;
  orderId: Types.ObjectId | null;
  previousAmount: number;
  recentAmount: number;
  currentTotal: number;
  reasonOfTransaction:
    | "Order delivered"
    | "Withdraw"
    | "Cancel after delivered"
    | "Cancel by admin after delivered"
    | "Order delivered by admin";
}

// Schema definition
const TransactionSchema: Schema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", default: null },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", default: null },
    previousAmount: { type: Number, required: true },
    recentAmount: { type: Number, required: true },
    currentTotal: { type: Number, required: true },
    reasonOfTransaction: {
      type: String,
      enum: [
        "Order delivered",
        "Cancel after delivered",
        "Cancel by admin after delivered",
        "Order delivered by admin",
        "Withdraw",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

// Model definition
const Transaction = model<Transaction>("Transaction", TransactionSchema);

export default Transaction;
