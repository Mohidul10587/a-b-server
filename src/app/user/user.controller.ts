import { Request, Response } from "express";
import User, { IUser } from "./user.model";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { setRefreshTokenCookie } from "../shared/setToken";
import Order from "../order/order.model";
import Product from "../product/model";
declare module "express" {
  interface Request {
    user?: IUser; // Adjust the type based on your User model
  }
}
dotenv.config();

// controllers/authController.ts

export const signUpByCredentials = async (req: Request, res: Response) => {
  const { authProvider, email, phone, slug, password, name } = req.body;

  // 1️⃣ প্রাথমিক ভ্যালিডেশন – authProvider সঠিক কি না
  if (!["email", "phone", "slug"].includes(authProvider)) {
    return res
      .status(400)
      .json({ message: "Auth Provider must be 'email', 'phone' or 'slug'" });
  }

  // 2️⃣ ফিল্ড চেক: যে প্রোভাইডার, সেই অনুযায়ী ইনপুট থাকা বাধ্যতামূলক
  switch (authProvider) {
    case "email":
      if (!email)
        return res
          .status(400)
          .json({ message: "Provide email for email signup" });
      break;

    case "phone":
      if (!phone)
        return res
          .status(400)
          .json({ message: "Provide phone for phone signup" });
      break;

    case "slug":
      if (!slug)
        return res
          .status(400)
          .json({ message: "Provide slug for slug signup" });
      break;
  }

  // 3️⃣ পাসওয়ার্ড চেক
  if (!password) {
    return res
      .status(400)
      .json({ message: "Password is required for credential signup" });
  }

  // 4️⃣ কমন ডেটা তৈরি
  const hashedPwd = await bcrypt.hash(password, 10);
  const baseData = {
    name,
    password: hashedPwd,
    authProvider,
    slug: slug || "slug",
  };

  try {
    let user;

    switch (authProvider) {
      case "email":
        // ডুপ্লিকেট চেক
        if (await User.findOne({ email }))
          return res.status(409).json({ message: "Email already in use" });

        user = await User.create({ ...baseData, email });
        break;

      case "phone":
        if (await User.findOne({ phone }))
          return res.status(409).json({ message: "Phone already in use" });

        user = await User.create({ ...baseData, phone });
        break;

      case "slug":
        if (await User.findOne({ slug }))
          return res.status(409).json({ message: "Slug already in use" });

        user = await User.create({ ...baseData, slug });
        break;
    }

    // 5️⃣ রিফ্রেশ‑টোকেন কুকি সেট এবং রেসপন্স
    const refreshToken = setRefreshTokenCookie(res, user!);
    return res
      .status(201)
      .json({ user, refreshToken, message: "Created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

// controllers/authController.ts

export const logInByCredentials = async (req: Request, res: Response) => {
  const { authProvider, identifier, password } = req.body;
  /* -------- 1. ভ্যালিডেশন ---------- */
  if (!["email", "phone", "slug"].includes(authProvider)) {
    return res
      .status(400)
      .json({ message: "Auth Provider must be 'email' or 'phone' or 'slug'" });
  }

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Identifier & password are required" });
  }

  let query = {};
  if (authProvider === "email") query = { email: identifier };
  if (authProvider === "phone") query = { phone: identifier };
  if (authProvider === "slug") query = { slug: identifier };

  try {
    /* -------- 2. ইউজার খুঁজে আনা ---------- */
    const user = await User.findOne(query).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* -------- 3. পাসওয়ার্ড যাচাই ---------- */
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* -------- 4. এক্সেস কন্ট্রোল (ঐচ্ছিক) ---------- */
    if (user.isUser === false) {
      return res.status(403).json({ message: "User is blocked" });
    }

    /* -------- 5. রিফ্রেশ‑টোকেন কুকি সেট ---------- */
    const refreshToken = setRefreshTokenCookie(res, user);

    /* -------- 6. সফল রেসপন্স ---------- */
    return res
      .status(200)
      .json({ user, refreshToken, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Failed to log in" });
  }
};

// controllers/authController.ts

export const googleUpsertUser = async (req: Request, res: Response) => {
  const { name, email, image, slug = "default-slug", role = "user" } = req.body;

  // 1. Check required fields
  if (!email || !name) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // 2. Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      user.lastLoginAt = new Date();
      await user.save();
    } else {
      // ==== CREATE NEW USER ====
      user = await User.create({
        name,
        email,
        image,
        slug,
        role,
        authProvider: "google",
        lastLoginAt: new Date(),
      });
    }

    // 3. Set Refresh Token Cookie
    const refreshToken = setRefreshTokenCookie(res, user);

    return res
      .status(200)
      .json({ user, refreshToken, message: "Google sign-in/up success" });
  } catch (err) {
    console.error("Google upsert error:", err);
    return res.status(500).json({ message: "Failed to upsert user" });
  }
};

export const setRefreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log("This is refresh token", refreshToken);
  if (!refreshToken) {
    return res.status(400).json({ message: "No token provided" });
  }

  //  ⚠️  Make sure your API is served from https://bikroy.96s.info
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none", // cross‑site cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.json({ message: "Cookie set" });
};

// Route to check user authentication
export const checkUser_Email = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    data: req.user, // User object retrieved from middleware
  });
};
export const allUserForAdmin = async (req: Request, res: Response) => {
  const users = await User.find().sort({ createdAt: -1 });

  return res.status(200).json({
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

// Update the status of a PageElement by ID
export const updateSellerStatus = async (req: Request, res: Response) => {
  const { userId } = req.params; // Make sure the ID is being passed correctly
  const { role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role }, // Ensure 'status' is the correct field
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedSellerId = updatedUser._id;
    const status = updatedUser.isSeller;

    try {
      const result = await Product.updateMany(
        { seller: updatedSellerId }, // Filter: match seller ID
        { $set: { display: status } } // Update: set updated timestamp
      );
    } catch (error) {
      console.error("Error updating products:", error);
    }
    res.status(200).json({
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating User status",
      error: error.message,
    });
  }
};

// Update the status of a PageElement by ID
export const updateUserStatus = async (req: Request, res: Response) => {
  const { userId } = req.params; // Make sure the ID is being passed correctly
  const { isUser } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isUser }, // Ensure 'status' is the correct field
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating User status",
      error: error.message,
    });
  }
};
// Update the status of a PageElement by ID
export const updateUserPassword = async (req: Request, res: Response) => {
  const { userId } = req.params; // Make sure the ID is being passed correctly
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User password updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating User password",
      error: error.message,
    });
  }
};
