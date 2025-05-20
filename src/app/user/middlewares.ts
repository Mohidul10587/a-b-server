import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "./user.model";

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

declare module "express" {
  interface Request {
    user?: IUser;
  }
}

// 🔄 Reusable Token Verifier by Allowed Roles
const verifyAdminTokenByRoles = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    jwt.verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
      if (err || !decoded?.userId) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired token" });
      }

      try {
        const user = await User.findById(decoded.userId);

        if (
          !user ||
          user.isUser === false ||
          !allowedRoles.includes(user.role)
        ) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }

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
};

// ✅ Middleware for all valid stuff (admin, customerManager, seller)
export const verifyStuffToken = verifyAdminTokenByRoles([
  "admin",
  "seller",
  "customerManager",
]);

// ✅ Middleware for individual roles
export const verifyUserToken = verifyAdminTokenByRoles([
  "admin",
  "seller",
  "customerManager",
  "user",
]);
export const verifyAdminToken = verifyAdminTokenByRoles(["admin"]);
export const verifySellerToken = verifyAdminTokenByRoles(["seller"]);
export const verifyCustomerManagerToken = verifyAdminTokenByRoles([
  "customerManager",
]);
export const verifyCustomerManagerAndAdminToken = verifyAdminTokenByRoles([
  "admin",
  "customerManager",
]);
export const verifySellerAndAdminToken = verifyAdminTokenByRoles([
  "admin",
  "seller",
]);
