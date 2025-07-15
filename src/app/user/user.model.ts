// models/User.model.ts
import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  username?: string;
  email?: string;
  phone?: string;
  gmail?: string;
  password?: string;
  role: "user" | "admin" | "seller" | "customerManager";
  name: string;
  slug: string;
  isSeller: boolean;
  isUser: boolean;
  birthday: string;
  gender: string;
  address: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  facebook: string;
  whatsapp: string;
  coverImg: string;
  image?: string;
  img?: string;
  display?: boolean;
  comparePassword?: (inputPassword: string) => Promise<boolean>;
  lastLoginAt: Date;
}

// === Mongoose Schema ===
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    gmail: { type: String, unique: true, sparse: true },
    facebook: { type: String, unique: true, sparse: true },
    password: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller", "customerManager"],
      default: "user",
    },
    name: { type: String, default: "" },
    slug: { type: String, unique: true, required: true },
    isSeller: { type: Boolean, default: false },
    isUser: { type: Boolean, default: true },
    birthday: { type: String, default: "" },
    gender: { type: String, default: "" },
    address: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    companyPhone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    image: { type: String, default: "" },
    img: { type: String, default: "" },
    display: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ slug: 1 });

// Middleware to make the slug unique if it's already taken
UserSchema.pre("save", async function (next) {
  const doc = this as unknown as IUser;
  if (!doc.isModified("slug")) return next();
  let slug = doc.slug;
  let counter = 1;
  // Check if a user with the same slug already exists
  while (await mongoose.models.User.exists({ slug })) {
    slug = `${doc.slug}-${counter++}`;
  }

  doc.slug = slug;
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
