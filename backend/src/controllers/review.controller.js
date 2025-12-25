import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

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
      (item) => item.product.toString() === productId.toString()
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
    const reviews = await Review.find({ productId });
    const totalRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        averageRating: totalRatings / reviews.length,
        totalReviews: reviews.length,
      },
      { new: true, validateBeforeSave: true }
    );

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res
        .status(500)
        .json({ message: "Failed to update product rating" });
    }

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

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
