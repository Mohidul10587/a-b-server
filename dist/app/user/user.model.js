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
const UserSchema = new mongoose_1.Schema({
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
                    _id: { type: mongoose_1.Schema.Types.ObjectId, default: null },
                },
                userCity: {
                    title: { type: String, default: "" },
                    _id: { type: mongoose_1.Schema.Types.ObjectId, default: null },
                },
            },
        ],
        default: [],
    },
    display: { type: Boolean, default: true },
    email: { type: String, unique: true, required: true },
    facebook: { type: String, default: "" },
    friday_openingHours: { type: String, default: "" },
    gender: { type: String, default: "" },
    gmail: { type: String, default: "" },
    image: { type: String, default: "" },
    isSeller: { type: Boolean, default: true },
    isUser: { type: Boolean, default: true },
    linkedin: { type: String, default: "" },
    lastName: { type: String, default: "" },
    monday_openingHours: { type: String, default: "" },
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
    saturday_openingHours: { type: String, default: "" },
    skype: { type: String, default: "" },
    slug: { type: String, unique: true, required: true },
    street: { type: String, default: "" },
    sunday_openingHours: { type: String, default: "" },
    thursday_openingHours: { type: String, default: "" },
    toDaysCoins: { type: Number, default: 0 },
    tuesday_openingHours: { type: String, default: "" },
    twitter: { type: String, default: "" },
    userCity: { type: String, default: "" },
    wednesday_openingHours: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
}, { timestamps: true });
UserSchema.index({ email: 1 });
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
