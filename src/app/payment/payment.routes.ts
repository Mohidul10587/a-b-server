import express, { Request, Response } from "express";
import axios from "axios";
import Order from "../order/order.model";

const router = express.Router();

// Environment variables (use your real credentials in .env)
const MERCHANT_ID = process.env.AMARPAY_MERCHANT_ID!;
const SIGNATURE_KEY = process.env.AMARPAY_SIGNATURE_KEY!;
const BASE_URL = "https://sandbox.aamarpay.com";
// const redirectUrl = "http://localhost:5000";
// const clientSideUrl = "http://localhost:3000";

const redirectUrl = "https://a-b-server.onrender.com";
const clientSideUrl = "https://book7.vercel.app";

router.post("/initialize-payment", async (req: Request, res: Response) => {
  const { amount, transactionId, name, email, phone, orderInfoForStore } =
    req.body;
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
    const response = await axios.post(`${BASE_URL}/jsonpost.php`, paymentData);

    Order.create(orderInfoForStore);
    // AmarPay returns a payment URL
    res.json({ paymentUrl: response.data.payment_url });
  } catch (error) {
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

router.post("/success/:transactionId", async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;

    const result = await Order.findOneAndUpdate(
      { paymentTnxId: transactionId },
      { $set: { paymentStatus: true } },
      { new: true }
    );
    console.log(result);

    res.redirect(`${clientSideUrl}/success/${transactionId}`);
  } catch (error) {
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

router.post("/fail/:transactionId", async (req: Request, res: Response) => {
  try {
    const transactionId = req.params.transactionId;
    res.redirect(`${clientSideUrl}/fail/${transactionId}`);
  } catch (error) {
    res.status(500).json({ message: "Payment initialization failed" });
  }
});
export default router;
