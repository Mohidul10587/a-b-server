// models/User.model.ts
import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IUser extends Document {
  address: string;
  birthday: string;
  city: string;
  coins: number;
  coinsTakingDate: string;
  companyEmail: string;
  companyName: string;
  companyPhone: string;
  contactInfo: string;
  country: string;
  coverPhoto?: string;
  deliveryOption: string;
  deliveryAddresses: {
    name: string;
    lastName: string;
    address: string;
    phone: string;
    email: string;
    region: { title: string; _id: ObjectId };
    userCity: { title: string; _id: ObjectId };
  }[];
  display?: boolean;
  email?: string;
  facebook: string;
  gender: string;
  gmail: string;
  image?: string;
  isSeller: boolean;
  isUser: boolean;
  linkedin: string;
  lastName: string;
  name?: string;
  notifications: {
    _id: string;
    type: "message" | "order" | "offer";
    title: string;
    description: string;
    date: string;
    isRead: boolean;
    link: string;
    img: string;
  }[];
  oneClickPayStartedAt: string;
  phone?: string | null;
  img?: string;
  postalCode: string;
  region: string;
  skype: string;
  slug: string;
  street: string;
  toDaysCoins: number;
  tuesday_openingHours: string;
  twitter: string;
  userCity: string;
  whatsapp: string;
  password: string;
  role: "user" | "admin" | "seller" | "customerManager";
}

const UserSchema = new Schema<IUser>(
  {
    address: { type: String, default: "" },
    birthday: { type: String, default: "" },
    city: { type: String, default: "" },
    coins: { type: Number, default: 0 },
    coinsTakingDate: { type: String, default: "" },
    companyEmail: { type: String, default: "" },
    companyName: { type: String, default: "" },
    companyPhone: { type: String, default: "" },
    contactInfo: { type: String, default: "" },
    country: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    deliveryOption: { type: String, default: "" },
    deliveryAddresses: {
      type: [
        {
          name: { type: String, default: "" },
          lastName: { type: String, default: "" },
          address: { type: String, default: "" },
          phone: { type: String, default: "" },
          email: { type: String, default: "" },
          region: {
            title: { type: String, default: "" },
            _id: { type: Schema.Types.ObjectId, default: null },
          },
          userCity: {
            title: { type: String, default: "" },
            _id: { type: Schema.Types.ObjectId, default: null },
          },
        },
      ],
      default: [],
    },
    display: { type: Boolean, default: true },
    email: { type: String, unique: true, required: true },
    facebook: { type: String, default: "" },
    gender: { type: String, default: "" },
    gmail: { type: String, default: "" },
    image: { type: String, default: "" },
    isSeller: { type: Boolean, default: true },
    isUser: { type: Boolean, default: true },
    linkedin: { type: String, default: "" },
    lastName: { type: String, default: "" },
    name: { type: String, default: "" },
    notifications: {
      type: [
        {
          _id: { type: String, default: "" },
          description: { type: String, default: "" },
          img: { type: String, default: "/defaultUser.jpeg" },
          isRead: { type: Boolean, default: false },
          link: { type: String, default: "" },
          title: { type: String, default: "" },
          type: {
            type: String,
            enum: ["message", "order", "offer"],
            default: "message",
          },
        },
      ],
      default: [],
    },
    oneClickPayStartedAt: { type: String, default: "" },
    password: { type: String, default: "a" },
    phone: { type: String, default: null },
    img: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    region: { type: String, default: "" },
    role: { type: String, default: "user" },
    skype: { type: String, default: "" },
    slug: { type: String, unique: true, required: true },
    street: { type: String, default: "" },
    toDaysCoins: { type: Number, default: 0 },
    twitter: { type: String, default: "" },
    userCity: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
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
