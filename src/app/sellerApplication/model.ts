import mongoose, { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongoose";

interface ISellerApplication extends Document {
  user: ObjectId; // Reference to User
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyFacebook: string;
  companyWhatsapp: string;
  companyCoverImg: string;
  companyProfileImg?: string;
  firstContactPersonName: string;
  firstContactPersonPhone: string;
  secondContactPersonName: string;
  secondContactPersonPhone: string;
  commission: number;
  status: "pending" | "approved" | "rejected";
}

const SellerApplicationSchema = new Schema<ISellerApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    companyPhone: { type: String, default: "" },
    companyFacebook: { type: String, default: "" },
    companyWhatsapp: { type: String, default: "" },
    companyCoverImg: { type: String, default: "" },
    companyProfileImg: { type: String, default: "" },
    firstContactPersonName: { type: String, default: "" },
    firstContactPersonPhone: { type: String, default: "" },
    secondContactPersonName: { type: String, default: "" },
    secondContactPersonPhone: { type: String, default: "" },
    commission: { type: Number, default: 10 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const SellerApplication = model<ISellerApplication>(
  "SellerApplication",
  SellerApplicationSchema
);
