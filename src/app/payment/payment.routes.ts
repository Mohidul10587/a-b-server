import express, { Request, Response } from "express";
import axios from "axios";
import Order from "../order/order.model";
import Cart from "../cart/cart.model";
import { verifyUserToken } from "../user/middlewares";
import mongoose from "mongoose";

const router = express.Router();

// Environment variables
const MERCHANT_ID = process.env.AMARPAY_MERCHANT_ID!;
const SIGNATURE_KEY = process.env.AMARPAY_SIGNATURE_KEY!;
const BASE_URL = "https://sandbox.aamarpay.com";

// const redirectUrl = "http://localhost:5000";
// const clientSideUrl = "http://localhost:3000";

const redirectUrl = "https://a-b-server.vercel.app";
const clientSideUrl = "https://www.notebookprokash.com";

// Initialize Payment Route
router.post(
  "/initialize-payment",
  verifyUserToken,
  async (req: Request, res: Response) => {
    const { amount, transactionId, name, email, phone, orderInfoForStore } =
      req.body;
    const userId = req.user?._id;

    if (!amount || !transactionId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // 1. Create order in DB
      await Order.create([orderInfoForStore], { session });

      // 2. Prepare payment data
      const paymentData = {
        store_id: MERCHANT_ID || "aamarpaytest",
        signature_key: SIGNATURE_KEY || "dbb74894e82415a2f7ff0ec3a97e4183",
        amount,
        desc: "This is description",
        payment_type: "VISA", // or MOBILE_BANKING, etc.
        currency: "BDT",
        tran_id: transactionId,
        cus_name: name,
        cus_email: email || "example@gmail.com",
        cus_phone: phone,
        success_url: `${redirectUrl}/payment/success/${transactionId}`,
        fail_url: `${redirectUrl}/payment/fail/${transactionId}`,
        cancel_url: `${clientSideUrl}/checkout`,
        type: "json",
      };

      // 3. Send request to AmarPay
      const response = await axios.post(
        `${BASE_URL}/jsonpost.php`,
        paymentData
      );

      if (!response.data.payment_url) {
        throw new Error("Failed to receive payment URL");
      }

      // 4. Clear cart after payment initialization is successful
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { cartItems: [] } },
        { session }
      );

      // 5. Commit transaction
      await session.commitTransaction();

      // 6. Respond with payment URL
      res.json({ paymentUrl: response.data.payment_url });
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({
        message: "Payment initialization failed",
        error: (error as any).message || "Unknown error",
      });
    } finally {
      session.endSession();
    }
  }
);

// Payment Success
router.post("/success/:transactionId", async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;

    const result = await Order.findOneAndUpdate(
      { paymentTnxId: transactionId },
      { $set: { paymentStatus: true } },
      { new: true }
    );

    res.redirect(`${clientSideUrl}/success/${transactionId}`);
  } catch (error) {
    res.status(500).json({ message: "Payment success processing failed" });
  }
});

// Payment Fail
router.post("/fail/:transactionId", async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    res.redirect(`${clientSideUrl}/fail/${transactionId}`);
  } catch (error) {
    res.status(500).json({ message: "Payment fail processing failed" });
  }
});

export default router;
