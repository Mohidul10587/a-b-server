// models/User.model.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  slug: string;
  email?: string;
  image?: string;
  phone?: string | null;
  password: string;
  isSeller: boolean;
  isUser: boolean;
  oneClickPayStartedAt: string;
  sellerId: Schema.Types.ObjectId | null;
  coins: number;
  coinsTakingDate: string;
  toDaysCoins: number;
  companyName: string;
  companyEmail: string;
  country: string;
  city: string;
  postalCode: string;
  companyPhone: string;
  street: string;
  address: string;
  facebook: string;
  twitter: string;
  gmail: string;
  whatsapp: string;
  skype: string;
  linkedin: string;
  monday_openingHours: string;
  tuesday_openingHours: string;
  wednesday_openingHours: string;
  thursday_openingHours: string;
  friday_openingHours: string;
  saturday_openingHours: string;
  sunday_openingHours: string;
  photo?: string;
  coverPhoto?: string;
  contactInfo: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, default: "" },
    slug: { type: String, unique: true },
    phone: { type: String, default: null },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    image: { type: String, default: "" },
    isSeller: { type: Boolean, required: true },
    isUser: { type: Boolean, default: true },
    oneClickPayStartedAt: { type: String, default: "" },
    coins: { type: Number, default: 0 },
    toDaysCoins: { type: Number, default: 0 },
    coinsTakingDate: { type: String, default: "" },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", default: null },
    companyName: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    companyPhone: { type: String, default: "" },
    street: { type: String, default: "" },
    address: { type: String, default: "" },
    facebook: { type: String, default: "" },
    twitter: { type: String, default: "" },
    gmail: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    skype: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    monday_openingHours: { type: String, default: "" },
    tuesday_openingHours: { type: String, default: "" },
    wednesday_openingHours: { type: String, default: "" },
    thursday_openingHours: { type: String, default: "" },
    friday_openingHours: { type: String, default: "" },
    saturday_openingHours: { type: String, default: "" },
    sunday_openingHours: { type: String, default: "" },
    photo: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    contactInfo: { type: String, default: "" },
  },
  { timestamps: true }
);

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
