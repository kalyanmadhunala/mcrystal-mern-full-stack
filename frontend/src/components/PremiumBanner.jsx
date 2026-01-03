import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";
import { assets } from "../assets/assets";

const PremiumBanner = () => {
  const {
    marbleProducts = [],
    ceramicProducts = [],
  } = useContext(ShopContext);

  const [luxuryProducts, setLuxuryProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marbleProducts.length && !ceramicProducts.length) return;

    const luxuryMarbleProducts = marbleProducts
      .filter((item) => item.premiumItem && item.quantity > 0 )
      .slice(0, 3);

    const luxuryCeramicProducts = ceramicProducts
      .filter((item) => item.premiumItem && item.quantity > 0)
      .slice(0, 2);

    setLuxuryProducts([
      ...luxuryMarbleProducts,
      ...luxuryCeramicProducts,
    ]);

    setLoading(false);
  }, [marbleProducts, ceramicProducts]);

  return (
    <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[5vw] bg-primary m-8 rounded-4xl">
      <div className="flex flex-col items-center justify-center gap-3 text-center py-5 text-4xl">
        <p className="text-transparent playfair-display font-bold gradient-text animate-gradient pt-3">
          Premium Collection
        </p>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-white">
          Elegantly crafted marble and ceramic collections, blending tradition
          with artistry.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <ProductItemSkeleton key={index} />
            ))
          : luxuryProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                sellprice={item.sellprice}
                price={item.price}
                images={item.images}
                quantity={item.quantity ?? 1}
                textColor="text-white"
              />
            ))}
      </div>

      <div className="flex flex-col items-center justify-center pb-3 w-full">
        <img
          src={assets.frame}
          alt="decorative frame"
          className="max-h-12 md:w-[420px]"
        />
      </div>
    </div>
  );
};

export default PremiumBanner;
