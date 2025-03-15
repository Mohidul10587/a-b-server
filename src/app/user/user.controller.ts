import { Request, Response } from "express";
import User, { IUser } from "./user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { cloudinaryUpload } from "../shared/uploadSingleFileToCloudinary";
import { extractPublicKeyAndDelete } from "../shared/extractPublicKeyAndDelete";

import Settings from "../settings/settings.model";
import Order from "../order/order.model";
declare module "express" {
  interface Request {
    user?: IUser; // Adjust the type based on your User model
  }
}
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
// Helper function to send a consistent response with success flag and status code

// Create a new user with Google login
export const createUser = async (req: Request, res: Response) => {
  const { name, email, slug, image } = req.body;

  console.log("hit on the route");
  const sellerDefaultStatus = (await Settings.findOne())?.sellerDefaultStatus;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = setRefreshTokenCookie(res, existingUser);
      console.log(token);
      return res.status(200).json({
        success: true,
        user: existingUser,
        message: "User already existed",
      });
    }

    const newUser = await User.create({
      name,
      email,
      isSeller: sellerDefaultStatus,
      slug: slug ?? "my-slug",
      image,
    });

    const token = setRefreshTokenCookie(res, newUser);
    console.log(token);
    return res.status(200).json({
      success: true,
      user: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(200).json({
      success: false,
      user: {},
      message: "Creating user failed",
    });
  }
};

// Create a new user with email and password
export const createUserByEmailAndPassword = async (
  req: Request,
  res: Response
) => {
  const { name, email, slug, password } = req.body;
  const sellerDefaultStatus = (await Settings.findOne())?.sellerDefaultStatus;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,

        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      slug,
      isSeller: sellerDefaultStatus,
      password: hashedPassword,
    });
    setRefreshTokenCookie(res, newUser);
    return res.status(201).json({
      success: true,
      user: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Creating user failed",
    });
  }
};

// Authenticate user with email and password
export const logInWithEmailPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
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
    if (user.isUser === false) {
      return res.status(401).json({
        success: false,
        message: "User not allowed to log in",
      });
    }
    const token = setRefreshTokenCookie(res, user);
    console.log(token);
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

// Route to check user authentication
export const checkUser_Email = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    data: req.user, // User object retrieved from middleware
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();

  return res.status(200).json({
    success: true,
    users,
    message: "Users fetched successfully",
  });
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user",
      error: error.message,
    });
  }
};

export const getSingleUserBySlug = async (req: Request, res: Response) => {
  try {
    const userSlug = req.params.userSlug;

    if (!userSlug) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findOne({ slug: userSlug }).populate("sellerId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user",
      error: error.message,
    });
  }
};

export const getSingleUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = await User.findOne({ _id: id });
    res.status(201).json({
      message: "Fetched successfully!",
      respondedData: item, // Optionally, include the created category in the response
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to Fetch.",
      error: error.message,
    });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  try {
    const userSlug = req.params.userSlug;

    if (!userSlug) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findOne({ slug: userSlug }).select(
      "isSeller isUser"
    );

    return res.status(200).json({
      success: true,
      user: user,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user",
      error: error.message,
    });
  }
};
export const getContactInfoOfSingleUserBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const userSlug = req.params.userSlug;

    if (!userSlug) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findOne({ slug: userSlug });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
      message: "User fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user",
      error: error.message,
    });
  }
};

export const getSingleUserForAddToCartComponent = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const item = await User.findOne({ _id: userId }).select(
      "isOneClickPayOffer oneClickPayStartedAt coins name email phone address"
    );

    if (!item) {
      return res.status(404).json({
        message: "Data not found",
      });
    }

    return res.status(200).json({
      respondedData: item,
      message: "Fetched successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the user",
      error: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const { name, email, phone, photo, address, password, previousPhoto } =
      req.body;

    const files = req.files as { photo?: Express.Multer.File[] };
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    const photoFile = files?.photo?.[0];

    // Upload image if provided

    const photoUrl = await cloudinaryUpload(photoFile);

    if (photoUrl) {
      if (previousPhoto && isFromGoogleSite(previousPhoto) === false) {
        await extractPublicKeyAndDelete(previousPhoto);
      }
    }
    // Build the update object dynamically
    const updateData: any = {
      name,
      email,
      phone,
      address,
      image: photoUrl || photo,
    };

    if (password) {
      updateData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // Run validators for unique fields
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    setRefreshTokenCookie(res, updatedUser);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error(error);

    // Handle duplicate key errors (code 11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0]; // Identify the conflicting field
      const duplicateValue = error.keyValue[duplicateField]; // The value causing the conflict

      let message = `Duplicate value for ${duplicateField}: ${duplicateValue}.`;
      if (duplicateField === "phone") {
        message = "The phone number is already in use.";
      } else if (duplicateField === "email") {
        message = "The email address is already in use.";
      }

      return res.status(400).json({
        success: false,
        message,
        field: duplicateField, // Send the field for frontend handling if needed
      });
    }

    return res.status(500).json({
      success: false,
      message: "User update failed, please try again",
    });
  }
};

export const logOut = (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/", // Ensure this matches the path where the cookie was set
    httpOnly: true,
    secure: true, // Use `secure: true` in production when using HTTPS
    sameSite: "none", // Adjust based on your needs (e.g., Lax or Strict)
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const setRefreshTokenCookie = (res: Response, user: any): string => {
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "10d" } // Adjust expiration as needed
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true, // Only set secure flag in production
    sameSite: "none", // Ensure cross-origin cookies work
    maxAge: 10 * 24 * 60 * 60 * 1000, // Optional: Set expiration to 10 days
  });

  return refreshToken;
};

function isFromGoogleSite(url: string) {
  try {
    // Create a new URL object
    const parsedUrl = new URL(url);

    // Check if the hostname ends with 'googleusercontent.com' (common for Google-hosted content)
    return parsedUrl.hostname.endsWith("googleusercontent.com");
  } catch (error) {
    // If the URL is invalid, return false
    return false;
  }
}
// Get a single order by ID
export const getOrdersByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const orders = await Order.find({ userId });

    if (!orders) {
      res
        .status(200)
        .json({ success: false, message: "Order not found", orders });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order received successfully",
      orders: orders.reverse(),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: true, message: "Error retrieving order", error });
  }
};

// Get a single order by ID
export const getSingleOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById({
      _id: req.params.id,
      userId: req?.user?._id,
    });
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order", error });
  }
};
// Function to add coins to a user
export const addCoins = async (req: Request, res: Response) => {
  try {
    const { userId, coins, coinsTakingDate, toDaysCoins } = req.body;

    if (
      !userId ||
      typeof coins !== "number" ||
      typeof toDaysCoins !== "number" ||
      !coinsTakingDate
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find user and update coins and coinsTakingDate
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { coins }, // Increment coins
        coinsTakingDate,
        toDaysCoins,
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Coins added successfully",
      coins: user.coins,
      coinsTakingDate: user.coinsTakingDate,
    });
  } catch (error) {
    console.error("Error adding coins:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
