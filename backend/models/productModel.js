import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  sellprice: { type: Number, required: true },
  price: { type: Number, required: true },
  images: { type: Array, required: true },
  material: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  bestseller: { type: Boolean },
  premiumItem: { type: Boolean },
  exculsiveItem: { type: Boolean },
  shortCode: {type: String, unique: true,},
  shareCount: {type: Number, default: 0},
  date: { type: Number, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("products", productSchema);

export default productModel;
