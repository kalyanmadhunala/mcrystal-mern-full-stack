import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import RibbonBadge from "./RibbonBadge";

const ProductItem = ({
  id,
  images,
  name,
  sellprice,
  price,
  quantity,
  textColor = "text-gray-600",
  loading = false,
}) => {
  const { currency } = useContext(ShopContext);

  /* ================= SKELETON ================= */
  if (loading) {
  return (
    <div className="relative block animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden">
        <div className="w-full aspect-square bg-gray-200 shimmer rounded-sm" />
      </div>

      {/* Text Skeletons */}
      <div className="pt-3 space-y-2">
        <div className="h-3 bg-gray-200 shimmer rounded w-4/5" />
        <div className="flex gap-2 items-center">
          <div className="h-4 bg-gray-200 shimmer rounded w-12" />
          <div className="h-3 bg-gray-200 shimmer rounded w-16" />
          <div className="h-3 bg-gray-200 shimmer rounded w-10" />
        </div>
      </div>
    </div>
  );
}



  /* ================= REAL PRODUCT ================= */
  const offerPercent = (((price - sellprice) / price) * 100).toFixed();

  return (
    <a
      href={`/products/${id}`}
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
          src={images?.[0]}
          alt={name}
        />

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
        <p className="text-md font-medium">
          {currency}
          {sellprice}
        </p>

        <p className="text-xs font-medium text-gray-400">
          M.R.P <span className="line-through">{currency}{price}</span>
        </p>

        <p
          className={`text-xs ${
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
    </a>
  );
};

export default ProductItem;
