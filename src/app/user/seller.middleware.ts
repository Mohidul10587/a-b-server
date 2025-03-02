import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import User from "./user.model";

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const verifySellerToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;

  jwt.verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token" });
    }

    try {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      if (user.isSeller) {
        req.user = user;
        next();
      }
      // Attach user object to request for further usage
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });
};

export default verifySellerToken;
// check
