import { Product } from "../models/product.model.js";

/**
 * Retrieve all products and send them as a JSON response.
 *
 * Responds with HTTP 200 and an array of product objects when successful;
 * responds with HTTP 500 and `{ message: "Internal server error" }` on failure.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export async function getAllProducts(req, res) {}

/**
 * Retrieve a product by ID and send it as a JSON HTTP response.
 *
 * Responds with 200 and the product when found, 404 with `{ message: "Product not found" }` when not found,
 * and 500 with `{ message: "Internal server error" }` on unexpected errors.
 *
 * @param {import('express').Request} req - Express request; expects `req.params.id` containing the product ID.
 * @param {import('express').Response} res - Express response used to send JSON responses with appropriate status codes.
 */
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}