import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

// admin controller this function will be used to create a new product
export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, category } = req.body;

    // Basic validation for required fields
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // check image file at least one image is provided
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    // check the maximum number of images is not exceeded
    if (req.files.length > 3) {
      return res
        .status(400)
        .json({ message: "A maximum of 3 images are allowed." });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, { folder: "products" });
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    return res.status(201).json({ message: "Product created", product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.error("Error creating product:", error);
  }
}

export async function getAllProducts(req, res) {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.error("Error fetching products:", error);
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    // handle image updates if new images are uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.error("Error fetching orders:", error);
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // // check if order not found
    // if (Order.findById(id) === null) {
    //   return res.status(404).json({ message: "Order not found" });
    // }

    const updateOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === "shipped" && !updateOrder.shippedAt) {
      updateOrder.shippedAt = new Date();
    }
    if (status === "delivered" && !updateOrder.deliveredAt) {
      updateOrder.deliveredAt = new Date();
    }

    await updateOrder.save();

    return res
      .status(200)
      .json({ message: "Order status updated", order: updateOrder });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.error("Error updating order status:", error);
  }
}

export async function getAllCustomers(req, res) {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ customers });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.error("Error fetching customers:", error);
  }
}

// we will implement this function to get dashboard statistics get all products, orders, customers, total sales, and total orders
export async function getDashboardStats(req, res) {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();

    const totalSalesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalSales = totalSalesData[0]?.total || 0;
    return res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalSales,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
    console.error("Error fetching dashboard stats:", error);
  }
}
