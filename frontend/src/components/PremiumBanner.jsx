import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import { assets } from "../assets/assets";

const PremiumBanner = () => {
  const { marbleProducts, ceramicProducts, showSearch } = useContext(ShopContext);

  const [luxuryProducts, setluxuryProducts] = useState([]);

  useEffect(() => {
  if (!marbleProducts.length || !ceramicProducts.length) return;

  const luxuryMarbleProducts = marbleProducts
    .filter((item) => item.premiumItem)
    .slice(36, 39);

  const luxuryCeramicProducts = ceramicProducts
    .filter((item) => item.premiumItem)
    .slice(9, 11);

  setluxuryProducts([...luxuryMarbleProducts, ...luxuryCeramicProducts]);
}, [marbleProducts, ceramicProducts]);


  return (
    <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[5vw] bg-primary m-8 rounded-4xl">
      <div className="flex flex-col items-center justify-center gap-3 text-center py-5 text-4xl mt-15">
        <p className="text-transparent playfair-display font-bold gradient-text animate-gradient pt-3">
          Premium Collection
        </p>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-white">
          Elegantly crafted marble collections, blending tradition with artistry.
        </p>
      </div>


      {/*Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-4 pb-8">
        {luxuryProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            images={item.images}
            name={item.name}
            price={item.price}
            sellprice={item.sellprice}
            quantity={item.quantity}
            textColor={"text-white"}
          />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center pb-3 w-full">
        <img src={assets.frame} alt="" className="w-md max-h-12 md:w-[420px]" />
      </div>
    </div>
  );
};

export default PremiumBanner;
