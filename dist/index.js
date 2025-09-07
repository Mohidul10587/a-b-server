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
// ImportRoutes
const routes_1 = __importDefault(require("./app/sellerApplication/routes"));
const writer_routes_1 = __importDefault(require("./app/writer/writer.routes"));
const routes_2 = __importDefault(require("./app/product/routes"));
const category_routes_1 = __importDefault(require("./app/category/category.routes"));
const subcategory_routes_1 = __importDefault(require("./app/subcategory/subcategory.routes"));
const user_route_1 = __importDefault(require("./app/user/user.route"));
const settings_routes_1 = __importDefault(require("./app/settings/settings.routes"));
const banner_routes_1 = __importDefault(require("./app/banner/banner.routes"));
const order_routes_1 = __importDefault(require("./app/order/order.routes"));
const element_routes_1 = __importDefault(require("./app/elements/element.routes"));
const suggestion_routes_1 = __importDefault(require("./app/suggestion/suggestion.routes"));
const payment_routes_1 = __importDefault(require("./app/payment/payment.routes"));
const publishers_routes_1 = __importDefault(require("./app/publishers/publishers.routes"));
const gallery_route_1 = __importDefault(require("./app/gallery/gallery.route"));
const cart_routes_1 = __importDefault(require("./app/cart/cart.routes"));
const wishlist_routes_1 = __importDefault(require("./app/wishlist/wishlist.routes"));
const transaction_route_1 = __importDefault(require("./app/transaction/transaction.route"));
const withdraw_route_1 = __importDefault(require("./app/withdraw/withdraw.route"));
const sellerOrder_route_1 = __importDefault(require("./app/ordersOFSeller/sellerOrder.route"));
const adminTransaction_route_1 = __importDefault(require("./app/adminTransaction/adminTransaction.route"));
const defaultInsertion_1 = require("./app/shared/defaultInsertion");
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
    (0, defaultInsertion_1.registerAdmin)("Admin", "admin@gmail.com", "admin123", "/defaultUser.jpg", "admin");
    (0, defaultInsertion_1.createDefaultSettings)();
});
// Middleware
app.use(body_parser_1.default.json()); // Parse JSON bodies
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://book7.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
// Main Route
app.get("/", (req, res) => {
    res.send("Welcome to the Price in Kenya Sever!"); // Send a welcome message
});
// UseRoutes
app.use("/sellerApplication", routes_1.default);
app.use("/sellerOrder", sellerOrder_route_1.default);
app.use("/writer", writer_routes_1.default);
app.use("/product", routes_2.default);
app.use("/category", category_routes_1.default);
app.use("/subcategory", subcategory_routes_1.default);
app.use("/settings", settings_routes_1.default);
app.use("/banner", banner_routes_1.default);
app.use("/order", order_routes_1.default);
app.use("/element", element_routes_1.default);
app.use("/suggestion", suggestion_routes_1.default);
app.use("/payment", payment_routes_1.default);
app.use("/publishers", publishers_routes_1.default);
app.use("/gallery", gallery_route_1.default);
app.use("/user", user_route_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/wishlist", wishlist_routes_1.default);
app.use("/transaction", transaction_route_1.default);
app.use("/withdraw", withdraw_route_1.default);
app.use("/adminTransaction", adminTransaction_route_1.default);
app.listen(port, () => {
    console.log(port);
});
