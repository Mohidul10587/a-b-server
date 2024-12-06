import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import Admin, { IAdmin } from "../admin_m/admin/admin.model";
import Settings from "../admin_m/settings/settings.model";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
export const createDefaultSettings = async (): Promise<void> => {
  try {
    const existingSettings = await Settings.findOne({});
    if (existingSettings) {
      return;
    } else {
      const settings = new Settings({
        logo: "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
        favicon:
          "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
        loto: "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
        fbImage:
          "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
        bgColor: "#ab4725",
        websiteTitle: "Price In Kenya",
        websiteBgColor: "#ffffff", // Default value, adjust if necessary
        copyright: "Copyright © 2012-2023 Price in Kenya. All rights reserved.",
        country: "Kenya",
        currencySymbol: "$",
        priceZero: "Currently Unavailable",
        highlights: "Highlights",
        shippingInside: "Inside Dhaka",
        shippingOutside: "Outside Dhaka",
        deliveryMethod1: "Delivery to your home or office",
        deliveryTime1: "Delivered between Same day delivery",
        deliveryMethod2: "Pickup Station",
        deliveryTime2: "Ready to pickup between Same day delivery",
        payment: "M-PESA Paybill",
        paymentText1: "Business no. 542542",
        paymentText2: "Account no. 794794",
        officeAddress:
          "Bihi Towers, Ground Floor, Suite G8, Moi Avenue, Nairobi CBD.",
        whatsapp: "",
        telegram: "",
        note: "That though we strive to keep all products up to date, price and availability are subject to change without prior notice.",
        order: "Order",
        orderText:
          "From Price in Kenya with fast delivery across the country and in-store pickup in Nairobi.",
        metaDescription: "",
        description: "",
        privacyPolicies: "",
        termsAndConditions: "",
        otherPolicies: "",
        sellerDefalutStatus: true,
        phone: "Your phone no",
      });

      await settings.save();
    }
  } catch (error) {
    console.error(error);
  }
};

export const registerAdmin = async (
  name: string,
  email: string,
  password: string,
  image: string
): Promise<void> => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin: IAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      image,
    });

    // Save admin to database
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.error("Admin registration failed", error);
  }
};
