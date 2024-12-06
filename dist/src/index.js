"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose")); // Import Mongoose
const admin_routes_1 = __importDefault(require("./app/admin/admin.routes")); // Import the room routes
const user_routes_1 = __importDefault(require("./app/user/user.routes")); // Import the room routes
const brand_routes_1 = __importDefault(require("./app/brand/brand.routes")); // Import the room routes
const product_routes_1 = __importDefault(require("./app/product/product.routes")); // Import the room routes
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser")); // Import body-parser
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Connect to MongoDB
mongoose_1.default.connect("mongodb+srv://mohid10587:Usz0E31KP3fyyBQ3@cluster5.4relj71.mongodb.net/price-in-kenya?retryWrites=true&w=majority");
// mongoose.connect("mongodb://127.0.0.1:27017/price-in-kenya" as string);
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
// Middleware
app.use(body_parser_1.default.json()); // Parse JSON bodies
app.use((0, cors_1.default)());
// Routes
app.use("/admin", admin_routes_1.default);
app.use("/user", user_routes_1.default);
app.use("/brand", brand_routes_1.default);
app.use("/product", product_routes_1.default);
// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
