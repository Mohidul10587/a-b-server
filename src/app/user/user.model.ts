// models/User.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ISellerInfo {
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
}

export interface IUser extends Document {
  email?: string;
  phone?: string;
  gmail?: string;
  password?: string;
  role: "user" | "admin" | "seller" | "staff";
  name: string;
  image: string;
  slug: string;
  birthday: string;
  gender: string;
  address: string;
  lastLoginAt: Date;
  isEnabledByAdmin: boolean;
  // New nested seller info
  sellerInfo?: ISellerInfo;

  comparePassword?: (inputPassword: string) => Promise<boolean>;
}

// === Mongoose Schema ===
const SellerInfoSchema = new Schema<ISellerInfo>(
  {
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
    commission: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    gmail: { type: String, unique: true, sparse: true },
    password: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin", "seller", "staff"],
      default: "user",
    },
    name: { type: String, default: "" },
    image: { type: String, default: "" },
    slug: { type: String, unique: true, required: true },
    birthday: { type: String, default: "" },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    lastLoginAt: { type: Date },
    isEnabledByAdmin: { type: Boolean, default: false },
    // Nested seller info
    sellerInfo: { type: SellerInfoSchema, default: {} },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ slug: 1 });

// Middleware to make slug unique
UserSchema.pre("save", async function (next) {
  const doc = this as IUser;
  if (!doc.isModified("slug")) return next();
  let slug = doc.slug;
  let counter = 1;

  while (await mongoose.models.User.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
