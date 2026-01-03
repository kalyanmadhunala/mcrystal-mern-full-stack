import express from "express";
import getAuthUser from "../middleware/getAuthUser.js";
import {
  toggleWishlist,
  getWishlistData,
  setWishlistData,
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/toggle", getAuthUser, toggleWishlist);
wishlistRouter.get("/getwishlistdata", getAuthUser, getWishlistData);
wishlistRouter.post("/setwishlistdata", getAuthUser, setWishlistData);

export default wishlistRouter;
