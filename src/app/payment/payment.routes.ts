import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

// Environment variables (use your real credentials in .env)
const MERCHANT_ID = process.env.AMARPAY_MERCHANT_ID!;
const SIGNATURE_KEY = process.env.AMARPAY_SIGNATURE_KEY!;
const BASE_URL = "https://sandbox.aamarpay.com";

router.post("/initialize-payment", async (req: Request, res: Response) => {
  const { amount, name, email, phone, transactionId, redirectUrl } = req.body;

  if (!amount || !transactionId || !redirectUrl) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const paymentData = {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      amount,
      payment_type: "VISA", // or MOBILE_BANKING, etc.
      currency: "BDT",
      tran_id: transactionId,
      cus_name: name,
      cus_email: email,
      cus_phone: phone,
      success_url: `${redirectUrl}/success`,
      fail_url: `${redirectUrl}/fail`,
      cancel_url: `${redirectUrl}/cancel`,
    };

    // Send request to AmarPay
    const response = await axios.post(`${BASE_URL}/request.php`, paymentData);

    // AmarPay returns a payment URL
    res.json({ paymentUrl: response.data });
  } catch (error) {
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

export default router;
