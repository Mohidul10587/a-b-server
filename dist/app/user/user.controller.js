"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUserStatus = exports.updateSellerStatus = exports.updatePassword = exports.updateStatus = exports.allStuffForAdminIndexPage = exports.allForAdminIndexPage = exports.update = exports.getSummaryOfActivity = exports.singleForEditPage = exports.getAuthenticatedUser = exports.getSingleOrder = exports.allOrdersOfUser = exports.logOut = exports.updateUser = exports.getSingleUserForAddToCartComponent = exports.getContactInfoOfSingleUserBySlug = exports.getStatus = exports.getDetailsOFSingleUserForAdminCustomerDetailsComponent = exports.singleForEditForSellerSettings = exports.getSingleUserById = exports.getSingleUserBySlug = exports.getSingleUser = exports.allUserForAdmin = exports.checkUser_Email = exports.setRefreshToken = exports.googleUpsertUser = exports.logInByCredentials = exports.signUpByCredentials = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const setToken_1 = require("../shared/setToken");
const order_model_1 = __importDefault(require("../order/order.model"));
const model_1 = __importDefault(require("../product/model"));
dotenv_1.default.config();
// controllers/authController.ts
const signUpByCredentials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    .json({ message: "Provide username for username signup" });
            break;
    }
    // 3️⃣ পাসওয়ার্ড চেক
    if (!password) {
        return res
            .status(400)
            .json({ message: "Password is required for credential signup" });
    }
    // 4️⃣ কমন ডেটা তৈরি
    const hashedPwd = yield bcryptjs_1.default.hash(password, 10);
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
                if (yield user_model_1.default.findOne({ email }))
                    return res.status(409).json({ message: "Email already in use" });
                user = yield user_model_1.default.create(Object.assign(Object.assign({}, baseData), { email }));
                break;
            case "phone":
                if (yield user_model_1.default.findOne({ phone }))
                    return res.status(409).json({ message: "Phone already in use" });
                user = yield user_model_1.default.create(Object.assign(Object.assign({}, baseData), { phone }));
                break;
            case "slug":
                if (yield user_model_1.default.findOne({ slug }))
                    return res.status(409).json({ message: "Usrname already in use" });
                user = yield user_model_1.default.create(Object.assign(Object.assign({}, baseData), { slug }));
                break;
        }
        // 5️⃣ রিফ্রেশ‑টোকেন কুকি সেট এবং রেসপন্স
        const refreshToken = (0, setToken_1.setRefreshTokenCookie)(res, user);
        return res
            .status(201)
            .json({ user, refreshToken, message: "Created successfully" });
    }
    catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).json({ message: "Failed to create user" });
    }
});
exports.signUpByCredentials = signUpByCredentials;
// controllers/authController.ts
const logInByCredentials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (authProvider === "email")
        query = { email: identifier };
    if (authProvider === "phone")
        query = { phone: identifier };
    if (authProvider === "slug")
        query = { slug: identifier };
    try {
        /* -------- 2. ইউজার খুঁজে আনা ---------- */
        const user = yield user_model_1.default.findOne(query).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        /* -------- 3. পাসওয়ার্ড যাচাই ---------- */
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        /* -------- 4. এক্সেস কন্ট্রোল (ঐচ্ছিক) ---------- */
        if (user.isUser === false) {
            return res.status(403).json({ message: "User is blocked" });
        }
        /* -------- 5. রিফ্রেশ‑টোকেন কুকি সেট ---------- */
        const refreshToken = (0, setToken_1.setRefreshTokenCookie)(res, user);
        /* -------- 6. সফল রেসপন্স ---------- */
        return res
            .status(200)
            .json({ user, refreshToken, message: "Login successful" });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Failed to log in" });
    }
});
exports.logInByCredentials = logInByCredentials;
// controllers/authController.ts
const googleUpsertUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, image, slug = "default-slug", role = "user" } = req.body;
    // 1. Check required fields
    if (!email || !name) {
        return res.status(400).json({ message: "Name and email are required" });
    }
    try {
        // 2. Check if user already exists
        let user = yield user_model_1.default.findOne({ email });
        if (user) {
            user.lastLoginAt = new Date();
            yield user.save();
        }
        else {
            // ==== CREATE NEW USER ====
            user = yield user_model_1.default.create({
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
        const refreshToken = (0, setToken_1.setRefreshTokenCookie)(res, user);
        return res
            .status(200)
            .json({ user, refreshToken, message: "Google sign-in/up success" });
    }
    catch (err) {
        console.error("Google upsert error:", err);
        return res.status(500).json({ message: "Failed to upsert user" });
    }
});
exports.googleUpsertUser = googleUpsertUser;
const setRefreshToken = (req, res) => {
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
exports.setRefreshToken = setRefreshToken;
// Route to check user authentication
const checkUser_Email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: req.user, // User object retrieved from middleware
    });
});
exports.checkUser_Email = checkUser_Email;
const allUserForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find().sort({ createdAt: -1 });
    return res.status(200).json({
        users,
        message: "Users fetched successfully",
    });
});
exports.allUserForAdmin = allUserForAdmin;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = yield user_model_1.default.findById(userId);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message,
        });
    }
});
exports.getSingleUser = getSingleUser;
const getSingleUserBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSlug = req.params.userSlug;
        if (!userSlug) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = yield user_model_1.default.findOne({ slug: userSlug });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message,
        });
    }
});
exports.getSingleUserBySlug = getSingleUserBySlug;
const getSingleUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const item = yield user_model_1.default.findOne({ _id: id });
        res.status(201).json({
            message: "Fetched successfully!",
            resData: item, // Optionally, include the created category in the response
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to Fetch.",
            error: error.message,
        });
    }
});
exports.getSingleUserById = getSingleUserById;
// Get all orders
const singleForEditForSellerSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ _id: req.params.id });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
exports.singleForEditForSellerSettings = singleForEditForSellerSettings;
// Get all orders
const getDetailsOFSingleUserForAdminCustomerDetailsComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_model_1.default.findOne({ _id: userId });
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
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId); // Ensure it's an ObjectId
        // Fetch all counts in parallel using Promise.all
        const [totalOrders, orderStatusCounts] = yield Promise.all([
            order_model_1.default.countDocuments({ userId: userObjectId }),
            order_model_1.default.aggregate([
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
        }, {});
        // Extract specific statuses, default to 0 if not present
        const totalPendingOrder = counts["Pending"] || 0;
        const totalApprovedOrder = counts["Approved"] || 0;
        const totalShippedOrder = counts["Shipped"] || 0;
        const totalCanceledOrder = counts["Cancelled"] || 0;
        const totalDeliveredOrder = counts["Delivered"] || 0;
        // Calculate total orders by summing up status counts
        const totalOrderNumber = totalPendingOrder +
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
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
exports.getDetailsOFSingleUserForAdminCustomerDetailsComponent = getDetailsOFSingleUserForAdminCustomerDetailsComponent;
const getStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSlug = req.params.userSlug;
        if (!userSlug) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = yield user_model_1.default.findOne({ slug: userSlug }).select("isSeller isUser");
        return res.status(200).json({
            success: true,
            user: user,
            message: "User fetched successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message,
        });
    }
});
exports.getStatus = getStatus;
const getContactInfoOfSingleUserBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSlug = req.params.userSlug;
        if (!userSlug) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const user = yield user_model_1.default.findOne({ slug: userSlug });
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message,
        });
    }
});
exports.getContactInfoOfSingleUserBySlug = getContactInfoOfSingleUserBySlug;
const getSingleUserForAddToCartComponent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const item = yield user_model_1.default.findOne({ _id: userId }).select("isOneClickPayOffer oneClickPayStartedAt coins name email phone address");
        if (!item) {
            return res.status(404).json({
                message: "Data not found",
            });
        }
        return res.status(200).json({
            resData: item,
            message: "Fetched successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching the user",
            error: error.message,
        });
    }
});
exports.getSingleUserForAddToCartComponent = getSingleUserForAddToCartComponent;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { name, address, password, image } = req.body;
        const hashedPassword = password
            ? yield bcryptjs_1.default.hash(password, 10)
            : undefined;
        // Build the update object dynamically
        const updateData = {
            name,
            address,
            image,
        };
        if (password) {
            updateData.password = hashedPassword;
        }
        // Update user
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true } // Run validators for unique fields
        );
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        (0, setToken_1.setRefreshTokenCookie)(res, updatedUser);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User update failed, please try again",
        });
    }
});
exports.updateUser = updateUser;
const logOut = (req, res) => {
    res.clearCookie("refreshToken", {
        path: "/", // Ensure this matches the path where the cookie was set
        httpOnly: true,
        secure: true, // Use `secure: true` in production when using HTTPS
        sameSite: "none", // Adjust based on your needs (e.g., Lax or Strict)
    });
    res.status(200).json({ message: "Logged out successfully" });
};
exports.logOut = logOut;
// Get a single order by ID
const allOrdersOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const orders = yield order_model_1.default.find({ user }).sort({ createdAt: -1 });
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
    }
    catch (error) {
        res
            .status(500)
            .json({ success: true, message: "Error retrieving order", error });
    }
});
exports.allOrdersOfUser = allOrdersOfUser;
// Get a single order by ID
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const order = yield order_model_1.default.findById({
            _id: req.params.id,
            userId: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving order", error });
    }
});
exports.getSingleOrder = getSingleOrder;
const getAuthenticatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        const item = yield user_model_1.default.findOne({ email: email });
        res.status(200).json({
            message: "Fetched successfully!",
            resData: item,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
// Get single
const singleForEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield user_model_1.default.findOne({ _id: req.params.id });
        res.status(200).json({
            message: "Fetched successfully!",
            resData: item,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.singleForEditPage = singleForEditPage;
// Get single
const getSummaryOfActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        // Fetch the last 5 orders (sorted by most recent first)
        const orders = yield order_model_1.default.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json({
            success: true,
            message: "Fetched successfully!",
            resData: { orders },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
            resData: null,
        });
    }
});
exports.getSummaryOfActivity = getSummaryOfActivity;
// Update
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedItem = yield user_model_1.default.findByIdAndUpdate(id, req.body, {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update.",
            error: error.message,
        });
    }
});
exports.update = update;
const allForAdminIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield user_model_1.default.find({ role: "user" }); // Adjust the query as needed
        res
            .status(200)
            .json({ message: "Fetched successfully!", resData: items.reverse() });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch.", error: error.message });
    }
});
exports.allForAdminIndexPage = allForAdminIndexPage;
const allStuffForAdminIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield user_model_1.default.find({
            role: { $in: ["seller", "customerManager"] },
        });
        res
            .status(200)
            .json({ message: "Fetched successfully!", resData: items.reverse() });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch.", error: error.message });
    }
});
exports.allStuffForAdminIndexPage = allStuffForAdminIndexPage;
// Update the status  by ID
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Make sure the ID is being passed correctly
    const { display } = req.body;
    try {
        const updateItem = yield user_model_1.default.findByIdAndUpdate(id, { display }, // Ensure 'status' is the correct field
        { new: true } // Return the updated document
        );
        if (!updateItem) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User status updated successfully",
            data: updateItem,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating User status",
            error: error.message,
        });
    }
});
exports.updateStatus = updateStatus;
// Update the status  by ID
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Make sure the ID is being passed correctly
    const { password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        const updateItem = yield user_model_1.default.findByIdAndUpdate(id, { password: hashedPassword }, // Ensure 'status' is the correct field
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating User status",
            error: error.message,
        });
    }
});
exports.updatePassword = updatePassword;
// Update the status of a PageElement by ID
const updateSellerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Make sure the ID is being passed correctly
    const { role } = req.body;
    try {
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { role }, // Ensure 'status' is the correct field
        { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const updatedSellerId = updatedUser._id;
        const status = updatedUser.isSeller;
        try {
            const result = yield model_1.default.updateMany({ seller: updatedSellerId }, // Filter: match seller ID
            { $set: { display: status } } // Update: set updated timestamp
            );
        }
        catch (error) {
            console.error("Error updating products:", error);
        }
        res.status(200).json({
            message: "User status updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating User status",
            error: error.message,
        });
    }
});
exports.updateSellerStatus = updateSellerStatus;
// Update the status of a PageElement by ID
const updateUserStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Make sure the ID is being passed correctly
    const { isUser } = req.body;
    try {
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { isUser }, // Ensure 'status' is the correct field
        { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User status updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating User status",
            error: error.message,
        });
    }
});
exports.updateUserStatus = updateUserStatus;
// Update the status of a PageElement by ID
const updateUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Make sure the ID is being passed correctly
    const { password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User password updated successfully",
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating User password",
            error: error.message,
        });
    }
});
exports.updateUserPassword = updateUserPassword;
