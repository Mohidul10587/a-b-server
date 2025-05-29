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
exports.getCountsOfDocuments = exports.updatePassword = exports.updateStatus = exports.allStuffForAdminIndexPage = exports.allForAdminIndexPage = exports.update = exports.getSummaryOfActivity = exports.singleForEditPage = exports.getAuthenticatedUser = exports.addCoins = exports.getSingleOrder = exports.getOrdersByUserId = exports.logOut = exports.updateUser = exports.getSingleUserForAddToCartComponent = exports.getContactInfoOfSingleUserBySlug = exports.getStatus = exports.getDetailsOFSingleUserForAdminCustomerDetailsComponent = exports.getSingleUserById = exports.getSingleUserBySlug = exports.getSingleUser = exports.checkUser_Email = exports.logInStuffWithEmailPassword = exports.logInUserWithEmailPassword = exports.createStuffByEmailAndPassword = exports.createUserByEmailAndPassword = exports.createUserBySocialMethod = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const order_model_1 = __importDefault(require("../order/order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const settings_model_1 = __importDefault(require("../settings/settings.model"));
const setToken_1 = require("../shared/setToken");
const category_model_1 = __importDefault(require("../category/category.model"));
dotenv_1.default.config();
// Helper function to send a consistent response with success flag and status code
// Create a new user with Google login
const createUserBySocialMethod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, slug, image } = req.body;
    const sellerDefaultStatus = (_a = (yield settings_model_1.default.findOne())) === null || _a === void 0 ? void 0 : _a.sellerDefaultStatus;
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            const token = (0, setToken_1.setRefreshTokenCookie)(res, existingUser);
            res.status(200).json({
                success: true,
                user: existingUser,
                token: token,
                message: "User already existed",
            });
            return;
        }
        const newUser = yield user_model_1.default.create({
            name,
            email,
            isSeller: sellerDefaultStatus,
            slug: slug !== null && slug !== void 0 ? slug : "my-slug",
            image,
        });
        const token = (0, setToken_1.setRefreshTokenCookie)(res, newUser);
        return res.status(200).json({
            success: true,
            user: newUser,
            token: token,
            message: "User created successfully",
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(200).json({
            success: false,
            user: {},
            message: "Creating user failed",
        });
    }
});
exports.createUserBySocialMethod = createUserBySocialMethod;
// Create a new user with email and password
const createUserByEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, slug, password, role } = req.body;
    const sellerDefaultStatus = (_a = (yield settings_model_1.default.findOne())) === null || _a === void 0 ? void 0 : _a.sellerDefaultStatus;
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_model_1.default.create({
            name,
            email,
            slug: slug !== null && slug !== void 0 ? slug : "my-slug",
            role: role !== null && role !== void 0 ? role : "user",
            isSeller: sellerDefaultStatus,
            password: hashedPassword,
        });
        (0, setToken_1.setRefreshTokenCookie)(res, newUser);
        return res.status(201).json({
            success: true,
            user: newUser,
            message: "Created successfully",
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create",
        });
    }
});
exports.createUserByEmailAndPassword = createUserByEmailAndPassword;
// Create a new user with email and password
const createStuffByEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, slug, password, role } = req.body;
    const sellerDefaultStatus = (_a = (yield settings_model_1.default.findOne())) === null || _a === void 0 ? void 0 : _a.sellerDefaultStatus;
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield user_model_1.default.create({
            name,
            email,
            slug: slug !== null && slug !== void 0 ? slug : "my-slug",
            role: role !== null && role !== void 0 ? role : "user",
            isSeller: sellerDefaultStatus,
            password: hashedPassword,
        });
        (0, setToken_1.setRefreshTokenCookie)(res, newUser);
        return res.status(201).json({
            success: true,
            user: newUser,
            message: "Created successfully",
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create",
        });
    }
});
exports.createStuffByEmailAndPassword = createStuffByEmailAndPassword;
// Authenticate user with email and password
const logInUserWithEmailPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
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
        const token = (0, setToken_1.setRefreshTokenCookie)(res, user);
        return res.status(200).json({
            success: true,
            user,
            token,
            message: "User authenticated successfully",
        });
    }
    catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
});
exports.logInUserWithEmailPassword = logInUserWithEmailPassword;
// Authenticate user with email and password
const logInStuffWithEmailPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
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
        const token = (0, setToken_1.setRefreshTokenCookie)(res, user);
        return res.status(200).json({
            success: true,
            user,
            token,
            message: "User authenticated successfully",
        });
    }
    catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed",
        });
    }
});
exports.logInStuffWithEmailPassword = logInStuffWithEmailPassword;
// Route to check user authentication
const checkUser_Email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: req.user, // User object retrieved from middleware
    });
});
exports.checkUser_Email = checkUser_Email;
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
    var _a;
    try {
        const userId = req.params.userId;
        const { name, email, phone, photo, address, password, previousPhoto } = req.body;
        const files = req.files;
        const hashedPassword = password
            ? yield bcryptjs_1.default.hash(password, 10)
            : undefined;
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        // Upload image if provided
        // Build the update object dynamically
        const updateData = {
            name,
            email,
            phone,
            address,
            image: photo,
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
        // Handle duplicate key errors (code 11000)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0]; // Identify the conflicting field
            const duplicateValue = error.keyValue[duplicateField]; // The value causing the conflict
            let message = `Duplicate value for ${duplicateField}: ${duplicateValue}.`;
            if (duplicateField === "phone") {
                message = "The phone number is already in use.";
            }
            else if (duplicateField === "email") {
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
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const orders = yield order_model_1.default.find({ user });
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
    }
    catch (error) {
        res
            .status(500)
            .json({ success: true, message: "Error retrieving order", error });
    }
});
exports.getOrdersByUserId = getOrdersByUserId;
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
// Function to add coins to a user
const addCoins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, coins, coinsTakingDate, toDaysCoins } = req.body;
        if (!userId ||
            typeof coins !== "number" ||
            typeof toDaysCoins !== "number" ||
            !coinsTakingDate) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        // Find user and update coins and coinsTakingDate
        const user = yield user_model_1.default.findByIdAndUpdate(userId, {
            $inc: { coins }, // Increment coins
            coinsTakingDate,
            toDaysCoins,
        }, { new: true } // Return the updated document
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "Coins added successfully",
            coins: user.coins,
            coinsTakingDate: user.coinsTakingDate,
        });
    }
    catch (error) {
        console.error("Error adding coins:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addCoins = addCoins;
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
const getCountsOfDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoriesCount = yield category_model_1.default.countDocuments();
        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            resData: categoriesCount,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving counts", error });
    }
});
exports.getCountsOfDocuments = getCountsOfDocuments;
