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
    isSeller: { type: Boolean, default: true },
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

// // user.ts

// import { Request, Response, NextFunction } from "express";
// import mongoose, { Document, Schema } from "mongoose";
// import bcrypt from "bcryptjs";
// import { z, ZodSchema } from "zod";

// // === Constants ===
// const SALT_ROUNDS = 10;

// // === Types ===

// export interface IUser extends Document {
//   username?: string;
//   email?: string;
//   phone?: string;
//   gmail?: string;
//   password?: string;
//   authProvider: AuthProvider;
//   role: Role;
//   name: string;
//   slug: string;
//   isSeller: boolean;
//   isUser: boolean;
//   birthday: string;
//   gender: string;
//   address: string;
//   companyName: string;
//   companyEmail: string;
//   companyPhone: string;
//   facebook: string;
//   whatsapp: string;
//   coverImg: string;
//   image?: string;
//   img?: string;
//   display?: boolean;
//   comparePassword?: (inputPassword: string) => Promise<boolean>;
// }

// // === Mongoose Schema ===
// const UserSchema = new Schema<IUser>(
//   {
//     username: { type: String, unique: true, sparse: true },
//     email: { type: String, unique: true, sparse: true },
//     phone: { type: String, unique: true, sparse: true },
//     gmail: { type: String, unique: true, sparse: true },
//     facebook: { type: String, unique: true, sparse: true },

//     password: { type: String, default: "" },
//     authProvider: {
//       type: String,
//       enum: ["email", "phone", "username", "gmail", "facebook"],
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: ["user", "admin", "seller", "customerManager"],
//       default: "user",
//     },

//     name: { type: String, default: "" },
//     slug: { type: String, unique: true, required: true },
//     isSeller: { type: Boolean, default: true },
//     isUser: { type: Boolean, default: true },
//     birthday: { type: String, default: "" },
//     gender: { type: String, default: "" },
//     address: { type: String, default: "" },
//     companyName: { type: String, default: "" },
//     companyEmail: { type: String, default: "" },
//     companyPhone: { type: String, default: "" },
//     whatsapp: { type: String, default: "" },
//     coverImg: { type: String, default: "" },
//     image: { type: String, default: "" },
//     img: { type: String, default: "" },
//     display: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// // === Middleware: Password Hash ===
// UserSchema.pre("save", async function (next) {
//   const user = this as IUser;
//   if (!user.password || !user.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(SALT_ROUNDS);
//     user.password = await bcrypt.hash(user.password, salt);
//     return next();
//   } catch (err) {
//     return next(err as Error);
//   }
// });

// // === Middleware: Slug Uniqueness ===
// UserSchema.pre("save", async function (next) {
//   const doc = this as IUser;
//   if (!doc.isModified("slug")) return next();
//   let slug = doc.slug;
//   let counter = 1;
//   while (await mongoose.models.User.exists({ slug })) {
//     slug = `${doc.slug}-${counter++}`;
//   }
//   doc.slug = slug;
//   next();
// });

// // === Instance Method: Compare Password ===
// UserSchema.methods.comparePassword = async function (
//   inputPassword: string
// ) {
//   return await bcrypt.compare(inputPassword, this.password || "");
// };

// // === Mongoose Model ===
// export const User = mongoose.model<IUser>("User", UserSchema);

// // === Zod Validation Schema ===
// export const userRegisterSchema = z
//   .object({
//     username: z.string().min(3).optional(),
//     email: z.string().email().optional(),
//     phone: z.string().min(8).optional(),
//     gmail: z.string().email().optional(),
//     facebook: z.string().url().optional(),

//     password: z.string().min(6).optional(),

//     authProvider: z.enum(["email", "phone", "username", "gmail", "facebook"]),
//     name: z.string().min(1, "নাম আবশ্যক"),
//     slug: z.string().min(1, "Slug দিতে হবে"),
//     role: z.enum(["user", "admin", "seller", "customerManager"]).default("user"),
//   })
//   .refine(
//     (data) =>
//       data.email || data.phone || data.username || data.gmail || data.facebook,
//     {
//       message:
//         "কমপক্ষে একটি লগইন তথ্য (email, phone, username, gmail, facebook) দিতে হবে।",
//       path: ["email"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (["email", "phone", "username"].includes(data.authProvider)) {
//         return !!data.password;
//       }
//       return true;
//     },
//     {
//       message: "এই পদ্ধতিতে password দিতে হবে।",
//       path: ["password"],
//     }
//   );

// // === Validation Middleware ===
// export const validateRequest = (schema: ZodSchema<any>) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const result = schema.safeParse(req.body);
//     if (!result.success) {
//       const errors = result.error.errors.map((err) => ({
//         field: err.path[0],
//         message: err.message,
//       }));
//       return res.status(400).json({ errors });
//     }
//     req.body = result.data;
//     next();
//   };
// };
