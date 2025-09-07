import mongoose, { Schema, model, Document } from "mongoose";
import { ObjectId } from "mongoose";

interface ISellerApplication extends Document {
  user: ObjectId; // Reference to User
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  firstContactPersonName: string;
  firstContactPersonPhone: string;
  secondContactPersonName?: string;
  secondContactPersonPhone?: string;
  facebook?: string;
  whatsapp?: string;
  coverImg?: string;
  image?: string;

  status: "pending" | "approved" | "rejected";
}

const SellerApplicationSchema = new Schema<ISellerApplication>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyPhone: { type: String, required: true },
    firstContactPersonName: { type: String, required: true },
    firstContactPersonPhone: { type: String, required: true },
    secondContactPersonName: { type: String, default: "" },
    secondContactPersonPhone: { type: String, default: "" },
    facebook: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    image: { type: String, default: "" },

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
