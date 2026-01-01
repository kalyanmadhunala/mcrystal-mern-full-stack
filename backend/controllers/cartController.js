import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

//add to cart
const addToCart = async (req, res) => {
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

    const cartData = user.cartData || {};
    const productData = await productModel.findById(itemId)

    if (productData.quantity === 0) {
      return res.json({ success: false, msg: "Product is out of Stock" });
    }

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, {cartData})

    return res.json({ success: true, msg: "Added to cart", cartData });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};


//update cart
const updateCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { itemId, quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.json({ success: false, msg: "Invalid product" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, msg: "Unauthenticated user" });
    }

    const cartData = user.cartData || {};

    if (quantity <= 0) {
      delete cartData[itemId]; // ✅ remove item
    } else {
      cartData[itemId] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, {cartData})

    return res.json({ success: true, msg: "Cart updated", cartData });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};

//get cart data
const getCartData = async (req, res) => {
  try {
    const userId = req.user?.id

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, msg: "UnAuthenticated User" });
    }

    let cartData = await userData.cartData;

    return res.json({ success: true, cartData });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};

const setCartData = async (req, res) => {
  try {
    const userId = req.user.id;

    const { cartData } = req.body;

    if (!userId || !cartData) {
      return res.json({ success: false, msg: "Missing data" });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.json({ success: false, msg: "UnAuthenticated User" });
    }

    // DB cart (productId: quantity)
    const dbCart = userData.cartData || {};
    const mergedCart = { ...dbCart };

    for (const productId in cartData) {
      if (!mongoose.Types.ObjectId.isValid(productId)) continue;

      const localQty = Number(cartData[productId]) || 0;
      if (localQty <= 0) continue;

      if (mergedCart[productId]) {
        mergedCart[productId] += localQty;
      } else {
        mergedCart[productId] = localQty;
      }
    }

    userData.cartData = mergedCart;
    userData.deleteAfter = undefined;
    await userData.save();
    return res.json({
      success: true,
      msg: "Cart synced successfully",
      cartData: mergedCart,
    });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, msg: error.message });
  }
};

export { addToCart, updateCart, getCartData, setCartData };
