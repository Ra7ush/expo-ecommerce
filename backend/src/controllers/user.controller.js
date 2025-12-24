import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = req.user;

    if (
      !label ||
      !fullName ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode ||
      !phoneNumber
    ) {
      return res
        .status(400)
        .json({ message: "All address fields are required." });
    }

    // chekc if this address is set to default
    if (isDefault) {
      user.addresses.forEach((address) => (address.isDefault = false));
    }
    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: !!isDefault,
    });
    await user.save();
    return res.status(201).json({
      message: "Address added successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}

export async function getAddresses(req, res) {
  try {
    const user = req.user;
    return res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}

export async function updateAddress(req, res) {
  try {
    const { addressId } = req.params;
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = req.user;
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }
    if (isDefault) {
      user.addresses.forEach((address) => (address.isDefault = false));
    }
    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;
    await user.save();
    return res.status(200).json({
      message: "Address updated successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}

export async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}

export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (user.wishlist.includes(productId)) {
      return res
        .status(400)
        .json({ message: "Product is already in the wishlist." });
    }
    user.wishlist.push(productId);
    await user.save();
    return res
      .status(200)
      .json({ message: "Product added to wishlist.", wishlist: user.wishlist });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}

export async function getWishlist(req, res) {
  try {
    // we are using populate, because wishlist is just an array of product IDs
    const user = await User.findById(req.user._id).populate("wishlist");
    return res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}
export async function removeFromWishlist(req, res) {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!user.wishlist.includes(productId)) {
      return res
        .status(404)
        .json({ message: "Product not found in the wishlist." });
    }

    user.wishlist.pull(productId);
    await user.save();

    return res.status(200).json({
      message: "Product removed from wishlist.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
}
