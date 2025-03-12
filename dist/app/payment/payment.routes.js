"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const order_model_1 = __importDefault(require("../order/order.model"));
const router = express_1.default.Router();
// Environment variables (use your real credentials in .env)
const MERCHANT_ID = process.env.AMARPAY_MERCHANT_ID;
const SIGNATURE_KEY = process.env.AMARPAY_SIGNATURE_KEY;
const BASE_URL = "https://sandbox.aamarpay.com";
// const redirectUrl = "http://localhost:5000";
// const clientSideUrl = "http://localhost:3000";
const redirectUrl = "https://a-b-server.onrender.com";
const clientSideUrl = "https://book7.vercel.app";
router.post("/initialize-payment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, transactionId, name, email, phone, orderInfoForStore } = req.body;
    if (!amount || !transactionId) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    try {
        const paymentData = {
            store_id: "aamarpaytest",
            signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
            amount,
            desc: "This is description",
            payment_type: "VISA", // or MOBILE_BANKING, etc.
            currency: "BDT",
            tran_id: transactionId,
            cus_name: name,
            cus_email: email ? email : "example@gmail.com",
            cus_phone: phone,
            success_url: `${redirectUrl}/payment/success/${transactionId}`,
            fail_url: `${redirectUrl}/payment/fail/${transactionId}`,
            cancel_url: `${clientSideUrl}/checkout`,
            type: "json",
        };
        // Send request to AmarPay
        const response = yield axios_1.default.post(`${BASE_URL}/jsonpost.php`, paymentData);
        order_model_1.default.create(orderInfoForStore);
        // AmarPay returns a payment URL
        res.json({ paymentUrl: response.data.payment_url });
    }
    catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
}));
router.post("/success/:transactionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionId = req.params.transactionId;
        const result = yield order_model_1.default.findOneAndUpdate({ paymentTnxId: transactionId }, { $set: { paymentStatus: true } }, { new: true });
        console.log(result);
        res.redirect(`${clientSideUrl}/success/${transactionId}`);
    }
    catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
}));
router.post("/fail/:transactionId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionId = req.params.transactionId;
        res.redirect(`${clientSideUrl}/fail/${transactionId}`);
    }
    catch (error) {
        res.status(500).json({ message: "Payment initialization failed" });
    }
}));
exports.default = router;
