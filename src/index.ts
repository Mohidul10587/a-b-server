import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"; // Import Mongoose
import cors from "cors";
import bodyParser from "body-parser"; // Import body-parser
import cookieParser from "cookie-parser";
import writerRoutes from "./app/writer/writer.routes";
import productRoutes from "./app/product/routes";
import categoryRoutes from "./app/category/category.routes";
import subcategoryRoutes from "./app/subcategory/subcategory.routes";
import userRoutes from "./app/user/user.route";
import settingsRoutes from "./app/settings/settings.routes";
import bannerRoutes from "./app/banner/banner.routes";
import orderRoutes from "./app/order/order.routes";
import elementsRoutes from "./app/elements/element.routes";
import suggestionRoutes from "./app/suggestion/suggestion.routes";
import paymentRoutes from "./app/payment/payment.routes";
import publishersRoutes from "./app/publishers/publishers.routes";
import galleryRoutes from "./app/gallery/gallery.route";
import cartRoutes from "./app/cart/cart.routes";
import wishlistRoutes from "./app/wishlist/wishlist.routes";
import transactionRoutes from "./app/transaction/transaction.route";
import withdrawRoutes from "./app/withdraw/withdraw.route";

import adminTransactionRoutes from "./app/adminTransaction/adminTransaction.route";
import {
  createDefaultSettings,
  registerAdmin,
} from "./app/shared/defaultInsertion";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB

const mongoUri = process.env.MONGODB_URI as string;
mongoose.connect(mongoUri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
  registerAdmin(
    "Admin",
    "admin@gmail.com",
    "admin123",
    "/defaultUser.jpg",
    "admin"
  );
  createDefaultSettings();
});

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://book7.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Main Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Price in Kenya Sever!"); // Send a welcome message
});

// Routes
app.use("/writer", writerRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/subcategory", subcategoryRoutes);
app.use("/settings", settingsRoutes);
app.use("/banner", bannerRoutes);
app.use("/order", orderRoutes);
app.use("/element", elementsRoutes);
app.use("/suggestion", suggestionRoutes);
app.use("/payment", paymentRoutes);
app.use("/publishers", publishersRoutes);
app.use("/gallery", galleryRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/transaction", transactionRoutes);
app.use("/withdraw", withdrawRoutes);
app.listen(port, () => {
  console.log(port);
});
