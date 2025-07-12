import dotenv from "dotenv";
import { Response } from "express";
import jwt from "jsonwebtoken";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
export const setRefreshTokenCookie = (res: Response, user: any): string => {
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "10d" } // Adjust expiration as needed
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  return refreshToken;
};
