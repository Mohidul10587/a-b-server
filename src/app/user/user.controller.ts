import { Request, Response } from "express";
import User, { IUser } from "./user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import mongoose from "mongoose";
import Settings from "../settings/settings.model";
import { setRefreshTokenCookie } from "../shared/setToken";
import Category from "../category/category.model";
import Writer from "../writer/writer.model";
import Order from "../order/order.model";
declare module "express" {
  interface Request {
    user?: IUser; // Adjust the type based on your User model
  }
}
dotenv.config();

// Helper function to send a consistent response with success flag and status code

// Create a new user with Google login
export const createUserBySocialMethod = async (req: Request, res: Response) => {
  const { name, email, slug, image } = req.body;
  const sellerDefaultStatus = (await Settings.findOne())?.sellerDefaultStatus;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const token = setRefreshTokenCookie(res, existingUser);
      res.status(200).json({
        success: true,
        user: existingUser,
        token: token,
        message: "User already existed",
      });
      return;
    }

    const newUser = await User.create({
      name,
      email,
      isSeller: sellerDefaultStatus,
      slug: slug ?? "my-slug",
      image,
    });

    const token = setRefreshTokenCookie(res, newUser);

    return res.status(200).json({
      success: true,
      user: newUser,
      token: token,

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
  const { name, email, slug, password, role } = req.body;
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
      slug: slug ?? "my-slug",
      role: role ?? "user",
      isSeller: sellerDefaultStatus,
      password: hashedPassword,
    });
    setRefreshTokenCookie(res, newUser);
    return res.status(201).json({
      success: true,
      user: newUser,
      message: "Created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create",
    });
  }
};

// Create a new user with email and password
export const createStuffByEmailAndPassword = async (
  req: Request,
  res: Response
) => {
  const { name, email, slug, password, role } = req.body;
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
      slug: slug ?? "my-slug",
      role: role ?? "user",
      isSeller: sellerDefaultStatus,
      password: hashedPassword,
    });
    setRefreshTokenCookie(res, newUser);
    return res.status(201).json({
      success: true,
      user: newUser,
      message: "Created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create",
    });
  }
};

// Authenticate user with email and password
export const logInUserWithEmailPassword = async (
  req: Request,
  res: Response
) => {
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

    return res.status(200).json({
      success: true,
      user,
      token,
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

// Authenticate user with email and password
export const logInStuffWithEmailPassword = async (
  req: Request,
  res: Response
) => {
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
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isUser === false || user.role === "user") {
      return res.status(401).json({
        success: false,
        message: "User not allowed to log in",
      });
    }

    const token = setRefreshTokenCookie(res, user);

    return res.status(200).json({
      success: true,
      user,
      token,
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

export const getSingleUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = await User.findOne({ _id: id });
    res.status(201).json({
      message: "Fetched successfully!",
      resData: item, // Optionally, include the created category in the response
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to Fetch.",
      error: error.message,
    });
  }
};

// Get all orders
export const getDetailsOFSingleUserForAdminCustomerDetailsComponent = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId });
    // Fetch orders sorted by latest first, only required fields
    // const ordersPromise = Order.find(
    //   { userId },
    //   {
    //     _id: 1,
    //     status: 1,
    //     name: 1,
    //     address: 1,
    //     phone: 1,
    //     cart: 1,
    //     createdAt: 1,
    //   }
    // )
    //   .sort({ _id: -1 }) // Sorting at DB level instead of `.reverse()`
    //   .lean();

    // Inside your controller
    const userObjectId = new mongoose.Types.ObjectId(userId as string); // Ensure it's an ObjectId

    // Fetch all counts in parallel using Promise.all
    const [totalOrders, orderStatusCounts] = await Promise.all([
      Order.countDocuments({ userId: userObjectId }),
      Order.aggregate([
        {
          $match: { userId: userObjectId }, // Use the correct ObjectId variable
        },
        {
          $group: {
            _id: "$status", // Group by order status
            count: { $sum: 1 }, // Count each status
          },
        },
      ]),
    ]);

    // Convert aggregation result into a map of status counts
    const counts = orderStatusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Extract specific statuses, default to 0 if not present
    const totalPendingOrder = counts["Pending"] || 0;
    const totalApprovedOrder = counts["Approved"] || 0;
    const totalShippedOrder = counts["Shipped"] || 0;
    const totalCanceledOrder = counts["Cancelled"] || 0;
    const totalDeliveredOrder = counts["Delivered"] || 0;

    // Calculate total orders by summing up status counts
    const totalOrderNumber =
      totalPendingOrder +
      totalApprovedOrder +
      totalShippedOrder +
      totalCanceledOrder +
      totalDeliveredOrder;

    // Resolve orders from promise
    // const orders = await ordersPromise;

    // Response data
    const data = {
      user,
      // orders,
      totalOrders,
      totalPendingOrder,
      totalApprovedOrder,
      totalShippedOrder,
      totalCanceledOrder,
      totalDeliveredOrder,
      totalOrderNumber,
    };

    res
      .status(200)
      .json({ success: true, resData: data, message: "Successfully fetched" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
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
      resData: item,
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
    const { name, address, password, image } = req.body;

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Build the update object dynamically
    const updateData: any = {
      name,
      address,
      image,
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

// Get a single order by ID
export const getOrdersByUserId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.user?._id;
    console.log("user", user);
    const orders = await Order.find({ user }).sort({ createdAt: -1 });

    if (!orders) {
      res
        .status(200)
        .json({ success: false, message: "Order not found", orders });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Order received successfully",
      orders: orders,
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

export const getAuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const item = await User.findOne({ email: email });

    res.status(200).json({
      message: "Fetched successfully!",
      resData: item,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};

// Get single
export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await User.findOne({ _id: req.params.id });

    res.status(200).json({
      message: "Fetched successfully!",
      resData: item,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};
// Get single
export const getSummaryOfActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?._id;

    // Fetch the last 5 orders (sorted by most recent first)
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      message: "Fetched successfully!",
      resData: { orders },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
      resData: null,
    });
  }
};

// Update
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedItem = await User.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated data
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: "Not found.",
      });
    }

    res.status(200).json({
      message: "Updated successfully!",
      resData: updatedItem,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update.",
      error: error.message,
    });
  }
};

export const allForAdminIndexPage = async (req: Request, res: Response) => {
  try {
    const items = await User.find({ role: "user" }); // Adjust the query as needed
    res
      .status(200)
      .json({ message: "Fetched successfully!", resData: items.reverse() });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch.", error: error.message });
  }
};

export const allStuffForAdminIndexPage = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await User.find({
      role: { $in: ["seller", "customerManager"] },
    });
    res
      .status(200)
      .json({ message: "Fetched successfully!", resData: items.reverse() });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch.", error: error.message });
  }
};

// Update the status  by ID
export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params; // Make sure the ID is being passed correctly
  const { display } = req.body;

  try {
    const updateItem = await User.findByIdAndUpdate(
      id,
      { display }, // Ensure 'status' is the correct field
      { new: true } // Return the updated document
    );

    if (!updateItem) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User status updated successfully",
      data: updateItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating User status",
      error: error.message,
    });
  }
};

// Update the status  by ID
export const updatePassword = async (req: Request, res: Response) => {
  const { id } = req.params; // Make sure the ID is being passed correctly
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const updateItem = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword }, // Ensure 'status' is the correct field
      { new: true } // Return the updated document
    );

    if (!updateItem) {
      return res
        .status(404)
        .json({ success: false, message: "Not found", resData: null });
    }

    res.status(200).json({
      success: true,
      message: "Updated successfully",
      resData: updateItem,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error updating User status",
      error: error.message,
    });
  }
};
