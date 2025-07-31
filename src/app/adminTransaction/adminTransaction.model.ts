import { model, Schema, Document, Types } from "mongoose";

// Type definition
export interface IAdminTransaction extends Document {
  sellerId: Types.ObjectId;
  userId: Types.ObjectId | null;
  orderId: Types.ObjectId | null;
  previousAmount: number;
  recentAmount: number;
  currentTotal: number;
  reasonOfTransaction:
    | "Order delivered"
    | "Cancel after delivered"
    | "Cancel by admin after delivered"
    | "Order delivered by admin"
    | "Withdraw";
}

// Schema definition
const AdminTransactionSchema: Schema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
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
const AdminTransaction = model<IAdminTransaction>(
  "AdminTransaction",
  AdminTransactionSchema
);

export default AdminTransaction;
