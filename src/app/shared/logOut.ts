import { Request, Response } from "express";

export const logOut = (req: Request, res: Response) => {
  res.clearCookie("_", {
    path: "/", // Ensure this matches the path where the cookie was set
    httpOnly: true,
    secure: true, // Use `secure: true` in production when using HTTPS
    sameSite: "none", // Adjust based on your needs (e.g., Lax or Strict)
  });

  res.status(200).json({ message: "Logged out successfully" });
};
