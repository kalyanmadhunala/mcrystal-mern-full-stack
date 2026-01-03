import mongoose from "mongoose";
import userModel from "../models/userModel.js";

/**
 * TOGGLE wishlist item (add/remove)
 */
const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.json({ success: false, msg: "Invalid product" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "Unauthenticated user" });
    }

    const wishlist = user.wishlist || {};

    if (wishlist[itemId]) {
      delete wishlist[itemId];
      await userModel.findByIdAndUpdate(userId, { wishlist });
      return res.json({
        success: true,
        msg: "Removed from wishlist",
        wishlistData: wishlist,
      });
    } else {
      wishlist[itemId] = true;
      await userModel.findByIdAndUpdate(userId, { wishlist });
      return res.json({
        success: true,
        msg: "Added to wishlist",
        wishlistData: wishlist,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};

/**
 * GET wishlist data
 */
const getWishlistData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "Unauthenticated user" });
    }

    return res.json({
      success: true,
      wishlistData: user.wishlist || {},
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};

/**
 * SYNC local wishlist to DB (on login)
 */
const setWishlistData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { wishlist } = req.body;

    if (!wishlist || typeof wishlist !== "object") {
      return res.json({ success: false, msg: "Invalid wishlist data" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "Unauthenticated user" });
    }

    const dbWishlist = user.wishlist || {};
    const mergedWishlist = { ...dbWishlist };

    // ✅ ONLY ADD missing items from local wishlist
    for (const productId in wishlist) {
      if (!mongoose.Types.ObjectId.isValid(productId)) continue;
      mergedWishlist[productId] = true;
    }

    user.wishlist = mergedWishlist;
    user.deleteAfter = undefined;
    await user.save();

    return res.json({
      success: true,
      msg: "Wishlist synced successfully",
      wishlistData: mergedWishlist,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};


export { toggleWishlist, getWishlistData, setWishlistData };
