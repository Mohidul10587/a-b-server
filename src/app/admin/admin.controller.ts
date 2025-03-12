import { Request, Response } from "express";

import Admin, { IAdmin } from "./admin.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
import ApiResponse from "../shared/response.type";

import Category from "../category/category.model";

import { setRefreshTokenCookie } from "../shared/setToken";

// Load environment variables
// Define color codes
declare module "express" {
  interface Request {
    admin?: IAdmin; // Adjust the type based on your User model
  }
}
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
export const registerAdmin = async (
  req: Request,
  res: Response<ApiResponse<IAdmin>>
): Promise<void> => {
  try {
    const { name, email, password, image } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
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

    setRefreshTokenCookie(res, admin);

    // Send response with token
    res.status(201).json({
      success: true,
      data: admin,
      message: "Admin registered successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Admin registration failed" });
  }
};

declare module "express" {
  interface Request {
    admin?: IAdmin; // Adjust the type based on your Admin model
  }
}

// Route to check admin authentication
export const checkAdmin = async (
  req: Request,
  res: Response<ApiResponse<IAdmin>>
) => {
  res.status(200).json({
    success: true,
    message: "Admin authenticated successfully",
    data: req.admin, // Admin object retrieved from middleware
  });
};

// Authenticate user with email and password
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    setRefreshTokenCookie(res, user);

    return res.status(200).json({
      success: true,
      user,
      message: "User authenticated successfully",
    });
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response<ApiResponse<{ token: string }>>
): Promise<Response<ApiResponse<{ token: string }>> | void> => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token provided" });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    const admin = await Admin.findById(payload.adminId);

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { adminId: admin._id, email: admin.email },
      JWT_SECRET,
      { expiresIn: "20000s" }
    );

    return res.status(200).json({
      success: true,
      token: accessToken,
      message: "New access token generated successfully",
    });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Update admin's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    // Send response
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password" });
  }
};
export const getCountsOfDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoriesCount = await Category.countDocuments();

    res.status(200).json({
      categoriesCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving counts", error });
  }
};

// change

// Controller to update admin email
export const updateAdminEmail = async (req: Request, res: Response) => {
  try {
    const { newEmail, password } = req.body;

    const adminId = req.admin?._id;

    // Check if admin is authenticated
    if (!adminId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the admin by ID
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Check if the new email already exists
    const existingAdmin = await Admin.findOne({ email: newEmail });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already in use" });
    }

    // Update admin email
    admin.email = newEmail;
    await admin.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: { email: newEmail },
    });
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ success: false, message: "Failed to update email" });
  }
};
