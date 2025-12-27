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
const verifyTokenByRoles = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    jwt.verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
      if (err || !decoded?.userId) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      try {
        const user = await User.findById(decoded.userId);
        if (!user || !allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Access denied" });
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
export const verifyStuffToken = verifyTokenByRoles([
  "admin",
  "seller",
  "customerManager",
]);

// ✅ Middleware for individual roles
export const verUserTkn = verifyTokenByRoles([
  "admin",
  "seller",
  "customerManager",
  "user",
]);
export const verAdminTkn = verifyTokenByRoles(["admin"]);
export const verifySellerToken = verifyTokenByRoles(["seller"]);
export const verifyCustomerManagerToken = verifyTokenByRoles([
  "customerManager",
]);
export const verifyCustomerManagerAndAdminToken = verifyTokenByRoles([
  "admin",
  "customerManager",
]);
export const verifySellerAndAdminToken = verifyTokenByRoles([
  "admin",
  "seller",
]);
