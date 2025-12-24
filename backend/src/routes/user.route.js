import { Router } from "express";
import { addAddress } from "../controllers/user.controller.js";
import {
  protectRoute,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.use(protectRoute);

// Address Routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

//Wishlist Routes
router.post("/wishlist", addToWishlist);
router.get("/wishlist", getWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router;
