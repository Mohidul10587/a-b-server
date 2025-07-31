// import { Request, Response } from "express";
// import Order from "./order.model";

// import mongoose from "mongoose";
// import User from "../user/user.model";
// import { SellerOrderModel } from "../ordersOFSeller/sellerOrder.model";
// import Cart from "../cart/cart.model";
// import Settings from "../settings/settings.model";

// export const submitAddToCartOrder = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const session = await mongoose.startSession(); // Start transaction session
//   session.startTransaction(); // Begin transaction
//   try {
//     const orderData = req.body;

//       // Create the main order
//       const order = await Order.create([{ ...orderData }], { session });

//       const sellerOrdersMap = new Map();

//       orderData.cart.forEach((product: any) => {
//         const sellerId = product.seller.toString();
//         if (!sellerOrdersMap.has(sellerId)) {
//           sellerOrdersMap.set(sellerId, {
//             sellerId: sellerId,
//             products: [],
//             name: orderData.name,
//             address: orderData.address,
//             location: orderData.address,
//             phone: orderData.phone,
//             status: orderData.status,
//             userId: orderData.userId,
//             paymentMethod: orderData.paymentMethod,
//             shippingMethod: orderData.shippingMethod,
//             transactionId: orderData.transactionId,
//             offerDeadLine: orderData?.offerDeadLine,
//             totalAmount: 0,
//           });
//         }
//         // Add product to the respective seller order
//         const sellerOrder = sellerOrdersMap.get(sellerId);
//         sellerOrder.products.push(product);
//         sellerOrder.totalAmount += product.price * product.quantity;
//       });

//       // Convert map values to array
//       const sellerOrders = Array.from(sellerOrdersMap.values());
//       await SellerOrderModel.insertMany(sellerOrders, { session });
//       await Cart.deleteOne({ userId: orderData.userId }).session(session);
//       await session.commitTransaction(); // Commit transaction if everything is successful
//       session.endSession(); // End session
//       res.status(201).json({
//         message: "Order submitted successfully",
//         order,
//       });

//   } catch (error) {
//     await session.abortTransaction(); // Rollback all changes if any error occurs
//     session.endSession(); // End session
//     console.error(error);
//     res.status(500).json({ message: "Error creating order", error });
//   }
// };

// export const submitBuyNowOrder = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const session = await mongoose.startSession(); // Start transaction session
//   session.startTransaction(); // Begin transaction
//   try {
//     const orderData = req.body;
//     const { oneClickPayStartedAt, userId } = orderData;
//     const additionalSettings = await Settings.findOne().session(
//       session
//     );
//     if (
//       additionalSettings?.isOneClickPay &&
//       isOfferValid(oneClickPayStartedAt, additionalSettings.oneClickPayTime) ===
//         false
//     ) {
//       const oneClickPayStartedAt = new Date();
//       const user = await User.findByIdAndUpdate(
//         userId,
//         { oneClickPayStartedAt },
//         { new: true, session }
//       );
//       // Create the main order
//       const order = await Order.create(
//         [
//           {
//             ...orderData,
//             offerDeadLine: user?.oneClickPayStartedAt,
//             oneClickPayOrder: true,
//           },
//         ],
//         { session }
//       );
//       const sellerOrdersMap = new Map();
//       orderData.cart.forEach((product: any) => {
//         const sellerId = product.seller.toString();
//         if (!sellerOrdersMap.has(sellerId)) {
//           sellerOrdersMap.set(sellerId, {
//             sellerId: sellerId,
//             products: [],
//             name: orderData.name,
//             address: orderData.address,
//             location: orderData.address,
//             phone: orderData.phone,
//             status: orderData.status,
//             userId: orderData.userId,
//             paymentMethod: orderData.paymentMethod,
//             shippingMethod: orderData.shippingMethod,
//             transactionId: orderData.transactionId,
//             offerDeadLine: user?.oneClickPayStartedAt,
//             oneClickPayOrder: true,
//             totalAmount: 0,
//           });
//         }

//         // Add product to the respective seller order
//         const sellerOrder = sellerOrdersMap.get(sellerId);
//         sellerOrder.products.push(product);
//         sellerOrder.totalAmount += product.price * product.quantity;
//       });

//       // Convert map values to array
//       const sellerOrders = Array.from(sellerOrdersMap.values());

//       await SellerOrderModel.insertMany(sellerOrders, { session });

//       await session.commitTransaction(); // Commit transaction if everything is successful
//       session.endSession(); // End session

//       res.status(201).json({
//         message: "Order submitted successfully",
//         order,
//       });
//     } else {
//       // Create the main order
//       const order = await Order.create([{ ...orderData }], { session });

//       const sellerOrdersMap = new Map();

//       orderData.cart.forEach((product: any) => {
//         const sellerId = product.seller.toString();
//         if (!sellerOrdersMap.has(sellerId)) {
//           sellerOrdersMap.set(sellerId, {
//             sellerId: sellerId,
//             products: [],
//             name: orderData.name,
//             address: orderData.address,
//             location: orderData.address,
//             phone: orderData.phone,
//             status: orderData.status,
//             userId: orderData.userId,
//             paymentMethod: orderData.paymentMethod,
//             shippingMethod: orderData.shippingMethod,
//             transactionId: orderData.transactionId,
//             offerDeadLine: orderData?.offerDeadLine,
//             totalAmount: 0,
//           });
//         }
//         // Add product to the respective seller order
//         const sellerOrder = sellerOrdersMap.get(sellerId);
//         sellerOrder.products.push(product);
//         sellerOrder.totalAmount += product.price * product.quantity;
//       });

//       // Convert map values to array
//       const sellerOrders = Array.from(sellerOrdersMap.values());
//       await SellerOrderModel.insertMany(sellerOrders, { session });

//       await session.commitTransaction(); // Commit transaction if everything is successful
//       session.endSession(); // End session
//       res.status(201).json({
//         message: "Order submitted successfully",
//         order,
//       });
//     }
//   } catch (error) {
//     await session.abortTransaction(); // Rollback all changes if any error occurs
//     session.endSession(); // End session
//     console.error(error);
//     res.status(500).json({ message: "Error creating order", error });
//   }
// };

// export const addWithPreviousOrderAsOneClickPayOffer = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const requestedProduct = req.body;

//     // Find the user's last order with one-click pay
//     const userLastOrder = await Order.findOne({
//       userId: requestedProduct.userId,
//       oneClickPayOrder: true,
//     })
//       .sort({ createdAt: -1 })
//       .session(session);

//     if (!userLastOrder) {
//       await session.abortTransaction();
//       session.endSession();
//       res.status(404).json({ message: "No previous order found." });
//       return;
//     }

//     // Calculate total price and shipping cost for the new product
//     const newProductTotalPrice =
//       requestedProduct.price * requestedProduct.quantity;
//     const newShippingCost = userLastOrder.shippingMethod.includes("Inside")
//       ? requestedProduct.shippingInside
//       : requestedProduct.shippingOutside;

//     // Update the cart with the new product
//     userLastOrder.cart.push({
//       _id: requestedProduct._id,
//       title: requestedProduct.title,
//       type: requestedProduct.type,
//       price: requestedProduct.price,
//       photo: requestedProduct.photo,
//       seller: requestedProduct.seller,
//       commissionForSeller: requestedProduct.commissionForSeller,
//       quantity: requestedProduct.quantity,
//       variantId: requestedProduct.variantId,
//       shippingInside: requestedProduct.shippingInside,
//       shippingOutside: requestedProduct.shippingOutside,
//       transactionId: requestedProduct.transactionId,
//     });

//     // Update the total price and shipping cost
//     userLastOrder.totalShippingCost += newShippingCost;

//     // Save the updated user order
//     await userLastOrder.save({ session });

//     // Find the seller order related to this user
//     let sellerOrder = await SellerOrderModel.findOne({
//       sellerId: requestedProduct.seller,
//       userId: requestedProduct.userId,
//       oneClickPayOrder: true,
//     })
//       .sort({ createdAt: -1 })
//       .session(session);

//     if (sellerOrder) {
//       // Otherwise, add new product to seller order
//       sellerOrder.products.push({
//         _id: requestedProduct._id,
//         title: requestedProduct.title,
//         type: requestedProduct.type,
//         variantId: requestedProduct.variantId,

//         price: requestedProduct.price,
//         photo: requestedProduct.photo,
//         seller: requestedProduct.seller,
//         commissionForSeller: requestedProduct.commissionForSeller,
//         quantity: requestedProduct.quantity,
//         transactionId: requestedProduct.transactionId,
//       });

//       // Update seller order total amount
//       sellerOrder.totalAmount += newProductTotalPrice;

//       // Save the updated seller order
//       await sellerOrder.save({ session });
//     } else {
//       // Create a new seller order if it doesn't exist
//       //@ts-ignore
//       sellerOrder = await SellerOrderModel.create(
//         [
//           {
//             sellerId: requestedProduct.seller,
//             products: [requestedProduct],
//             name: userLastOrder.name,
//             address: userLastOrder.address,
//             phone: userLastOrder.phone,
//             shippingMethod: userLastOrder.shippingMethod,
//             status: userLastOrder.status,
//             userId: userLastOrder.userId,
//             paymentMethod: userLastOrder.paymentMethod,
//             transactionId: userLastOrder.transactionId,
//             totalAmount: userLastOrder.total,
//             offerDeadLine: userLastOrder.submitTime,
//           },
//         ],
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       message: "Product added to previous order",
//       userOrder: userLastOrder,
//       sellerOrder: sellerOrder,
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error adding product to previous order:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const getAllOrders = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const orders = await Order.find();
//     res.status(200).json(orders.reverse());
//   } catch (error) {
//     res.status(500).json({ message: "Error retrieving orders", error });
//   }
// };
