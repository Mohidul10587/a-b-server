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
exports.getAuthenticatedUser = exports.addCoins = exports.getSingleOrder = exports.getOrdersByUserId = exports.logOut = exports.updateUser = exports.getSingleUserForAddToCartComponent = exports.getContactInfoOfSingleUserBySlug = exports.getStatus = exports.getSingleUserById = exports.getSingleUserBySlug = exports.getSingleUser = exports.getAllUsers = exports.checkUser_Email = exports.logInWithEmailPassword = exports.createUserByEmailAndPassword = exports.createUser = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const order_model_1 = __importDefault(require("../order/order.model"));
const settings_model_1 = __importDefault(require("../settings/settings.model"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
// Helper function to send a consistent response with success flag and status code
// Create a new user with Google login
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, slug, image } = req.body;
    const sellerDefaultStatus = (_a = (yield settings_model_1.default.findOne())) === null || _a === void 0 ? void 0 : _a.sellerDefaultStatus;
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            const token = setRefreshTokenCookie(res, existingUser);
            return res.status(200).json({
                success: true,
                user: existingUser,
                token: token,
                message: "User already existed",
            });
        }
        const newUser = yield user_model_1.default.create({
            name,
            email,
            isSeller: sellerDefaultStatus,
            slug: slug !== null && slug !== void 0 ? slug : "my-slug",
            image,
        });
        const token = setRefreshTokenCookie(res, newUser);
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
exports.createUser = createUser;
// Create a new user with email and password
const createUserByEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, slug, password } = req.body;
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
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            success: false,
            message: "Creating user failed",
        });
    }
});
exports.createUserByEmailAndPassword = createUserByEmailAndPassword;
// Authenticate user with email and password
const logInWithEmailPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const token = setRefreshTokenCookie(res, user);
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
exports.logInWithEmailPassword = logInWithEmailPassword;
// Route to check user authentication
const checkUser_Email = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: req.user, // User object retrieved from middleware
    });
});
exports.checkUser_Email = checkUser_Email;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    return res.status(200).json({
        success: true,
        users,
        message: "Users fetched successfully",
    });
});
exports.getAllUsers = getAllUsers;
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
            respondedData: item, // Optionally, include the created category in the response
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
            respondedData: item,
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
        setRefreshTokenCookie(res, updatedUser);
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
const setRefreshTokenCookie = (res, user) => {
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "10d" } // Adjust expiration as needed
    );
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // Only set secure flag in production
        sameSite: "none", // Ensure cross-origin cookies work
        maxAge: 10 * 24 * 60 * 60 * 1000, // Optional: Set expiration to 10 days
    });
    return refreshToken;
};
// Get a single order by ID
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const orders = yield order_model_1.default.find({ userId });
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
        const { id } = req.query;
        const item = yield user_model_1.default.findOne({ _id: id });
        const cart = yield cart_model_1.default.findOne({ userId: id });
        const cartProductQuantity = cart === null || cart === void 0 ? void 0 : cart.cartItems.reduce((total, item) => total + item.quantity, 0);
        res.status(200).json({
            message: "Fetched successfully!",
            respondedData: item,
            respondedCartData: cartProductQuantity,
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
