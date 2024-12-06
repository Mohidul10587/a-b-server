import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Admin from "./admin.model";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization header not provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the "Bearer <token>" format

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to authenticate token" });
    }

    try {
      const admin = await Admin.findById(decoded.adminId);
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }

      // Attach admin object to request for further usage
      req.admin = admin;
      next();
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  });
};

export default verifyToken;
// check
