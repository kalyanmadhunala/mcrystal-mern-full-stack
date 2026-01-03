import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import RibbonBadge from "./RibbonBadge";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const ProductItem = ({
  id,
  images,
  name,
  sellprice,
  price,
  quantity,
  textColor = "text-gray-600",
}) => {
  const { currency, addToWishlist, wishlist, navigate } = useContext(ShopContext);

  const offerPercent = (((price - sellprice) / price) * 100).toFixed();

  return (
    <Link
      to={`/products/${id}`}
      className={`${textColor} cursor-pointer relative block`}
    >
      {/* Ribbon */}
      {quantity > 0 && quantity <= 5 && <RibbonBadge text={quantity} />}

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          className={`hover:scale-110 transition ease-in-out ${
            quantity === 0 ? "bg-primary/30" : ""
          }`}
          src={images[0]}
          alt={name}
        />

        {/* Wishlist icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); 
            addToWishlist(id);
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-2 flex justify-center items-center z-20 cursor-pointer"
        >
          {wishlist[id] ? (
            <img
              src={assets.wishlist_full_icon}
              alt="wishlist_full_icon"
              className="w-5"
            />
          ) : (
            <img
              src={assets.wishlist_line_icon}
              alt="wishlist_line_icon"
              className="w-5"
            />
          )}
        </button>

        {quantity === 0 && (
          <div className="absolute inset-0 bg-primary/70 z-10 flex justify-center items-center">
            <p className="text-center text-white font-medium text-xl">
              Out of Stock
            </p>
          </div>
        )}
      </div>

      {/* Product Info */}
      <p className="pt-3 pb-1 text-sm">{name}</p>

      <div className="flex items-center gap-2">
        <p className="text-sm md:text-md font-medium">
          {currency}
          {sellprice}
        </p>

        <p className="text-[8px] md:text-xs font-medium text-gray-400">
          M.R.P{" "}
          <span className="line-through">
            {currency}
            {price}
          </span>
        </p>

        <p
          className={`text-[8px] md:text-xs ${
            offerPercent >= 75
              ? "bg-red-600 rounded-sm shadow-md text-white p-1"
              : "text-gray-400"
          }`}
        >
          {offerPercent >= 75
            ? `${offerPercent}% Off`
            : `(${offerPercent}% Off)`}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
