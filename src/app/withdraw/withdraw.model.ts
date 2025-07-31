import mongoose, { model, Schema, Document, Types } from "mongoose";

// Type definition
export interface Withdraw extends Document {
  sellerId: mongoose.Types.ObjectId;
  amount: number;
  accountNumber: string;
  withdrawalMethod: string;
  withdrawStatus: "Pending" | "Rejected" | "Approved";
}
// Schema definition
const WithdrawSchema: Schema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    amount: { type: Number, required: true },
    accountNumber: { type: String, required: true },
    withdrawalMethod: { type: String, required: true },
    withdrawStatus: {
      type: String,
      enum: ["Pending", "Rejected", "Approved"],
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Model definition
const Withdraw = model<Withdraw>("Withdraw", WithdrawSchema);

export default Withdraw;
