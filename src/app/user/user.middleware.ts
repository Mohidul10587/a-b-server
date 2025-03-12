import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
import User from "./user.model";

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const verifyUserToken = async (
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

      if (user.isUser === false) {
        return res
          .status(404)
          .json({ success: false, message: "User not allowed to log in" });
      }

      // Attach user object to request for further usage
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });
};

export default verifyUserToken;
// check
