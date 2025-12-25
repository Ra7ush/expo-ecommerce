import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req, res) {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // Atomically check and decrement stock in one operation
    const bulkOps = orderItems.map((item) => ({
      updateOne: {
        filter: {
          _id: item.product._id,
          stock: { $gte: item.quantity },
        },
        update: { $inc: { stock: -item.quantity } },
      },
    }));

    const bulkResult = await Product.bulkWrite(bulkOps, { session });

    if (bulkResult.modifiedCount !== orderItems.length) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient stock for one or more products",
      });
    }

    const order = await Order.create(
      [
        {
          user: user._id,
          clerkId: user.clerkId,
          orderItems,
          shippingAddress,
          paymentResult,
          totalPrice,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return res.status(201).json({ message: "Order created", order: order[0] });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
}

export async function getUserOrders(req, res) {
  try {
    const user = req.user;
    const orders = await Order.find({ clerkId: user.clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    //check if each order has been reviewed

    //check 3:50 frame
    const orderIds = orders.map((order) => order._id);
    const reviews = await Review.find({ orderId: { $in: orderIds } });
    const reviewedOrderIds = new Set(reviews.map((r) => r.orderId.toString()));

    const ordersWithReviewStatus = orders.map((order) => ({
      ...order.toObject(),
      hasReview: reviewedOrderIds.has(order._id.toString()),
    }));

    return res.status(200).json({ orders: ordersWithReviewStatus });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
