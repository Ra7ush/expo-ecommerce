import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

/**
 * Create a review for a product tied to a delivered order and update the product's average rating.
 *
 * Creates a new review when the authenticated user is authorized to review the specified order, the order has status "delivered", the product is part of the order, and the user has not already reviewed the product. After creating the review, recalculates and persists the product's `averageRating` and `totalReviews`.
 *
 * @param {object} req - Express request; expects `req.user` (authenticated user) and `req.body` containing `productId`, `orderId`, and `rating` (integer 1–5).
 * @param {object} res - Express response used to send HTTP status codes and JSON responses.
 */
export async function createReview(req, res) {
  try {
    const { productId, orderId, rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const user = req.user;
    // verify if the order is exists and delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.clerkId !== user.clerkId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to review this order" });
    }
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ message: "You can only review delivered orders" });
    }

    //verify product is in the order
    const productInOrder = order.products.find(
      (item) => item.produc.toString() === productId.toString()
    );
    if (!productInOrder) {
      return res
        .status(400)
        .json({ message: "Product not found in the order" });
    }

    // check if the review already exists
    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "Review already exists" });
    }

    const review = await Review.create({
      productId,
      userId: user._id,
      orderId,
      rating,
    });

    // update the product rating
    const product = await Product.findById(productId);
    const reviews = await Review.find({ productId });
    const totalRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.averageRating = totalRatings / reviews.length;
    product.totalReviews = reviews.length;

    await product.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Delete a review owned by the authenticated user and update the associated product's rating summary.
 *
 * Finds the review by ID from the request parameters, verifies the authenticated user is the review owner, deletes the review, recalculates the product's averageRating and totalReviews from remaining reviews, persists those updates, and sends an appropriate HTTP response.
 */
export async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    // update the product rating
    const reviews = await Review.find({ productId });
    const totalRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRatings / reviews.length : 0,
      totalReviews: reviews.length,
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}