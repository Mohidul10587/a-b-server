"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/User.model.ts
const mongoose_1 = __importStar(require("mongoose"));
// === Mongoose Schema ===
const UserSchema = new mongoose_1.Schema({
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
    commission: { type: Number, default: 0 },
}, { timestamps: true });
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ slug: 1 });
// Middleware to make the slug unique if it's already taken
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = this;
        if (!doc.isModified("slug"))
            return next();
        let slug = doc.slug;
        let counter = 1;
        // Check if a user with the same slug already exists
        while (yield mongoose_1.default.models.User.exists({ slug })) {
            slug = `${doc.slug}-${counter++}`;
        }
        doc.slug = slug;
        next();
    });
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
