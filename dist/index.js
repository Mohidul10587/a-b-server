"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose")); // Import Mongoose
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser")); // Import body-parser
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const admin_routes_1 = __importDefault(require("./app/admin_m/admin/admin.routes"));
const writer_routes_1 = __importDefault(require("./app/admin_m/writer/writer.routes"));
const product_routes_1 = __importDefault(require("./app/product/product.routes"));
const category_routes_1 = __importDefault(require("./app/admin_m/category/category.routes"));
const settings_routes_1 = __importDefault(require("./app/admin_m/settings/settings.routes"));
const banner_routes_1 = __importDefault(require("./app/admin_m/banner/banner.routes"));
const order_routes_1 = __importDefault(require("./app/admin_m/order/order.routes"));
const element_routes_1 = __importDefault(require("./app/admin_m/elements/element.routes"));
const suggestion_routes_1 = __importDefault(require("./app/admin_m/suggestion/suggestion.routes"));
const defaultInsertsion_1 = require("./app/shared/defaultInsertsion");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI;
mongoose_1.default.connect(mongoUri);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
    (0, defaultInsertsion_1.registerAdmin)("Admin", "admin@gmail.com", "admin123", "image");
    (0, defaultInsertsion_1.createDefaultSettings)();
});
// Middleware
app.use(body_parser_1.default.json()); // Parse JSON bodies
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://book7.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
// Main Route
app.get("/", (req, res) => {
    res.send("Welcome to the Price in Kenya Sever!"); // Send a welcome message
});
// Routes
app.use("/admin", admin_routes_1.default);
app.use("/writer", writer_routes_1.default);
app.use("/product", product_routes_1.default);
app.use("/category", category_routes_1.default);
app.use("/settings", settings_routes_1.default);
app.use("/banner", banner_routes_1.default);
app.use("/order", order_routes_1.default);
app.use("/element", element_routes_1.default);
app.use("/suggestion", suggestion_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
