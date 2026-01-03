import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";
import ProductItemSkeleton from "./ProductItemSkeleton";

const BestSeller = () => {
  const { marbleProducts = [], ceramicProducts = [] } = useContext(ShopContext);

  const [bestSeller, setBestSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (marbleProducts.length || ceramicProducts.length) {
      setLoading(false);
    }
  }, [marbleProducts, ceramicProducts]);

  useEffect(() => {
    if (!marbleProducts.length && !ceramicProducts.length) return;

    const bestMarbleProducts = marbleProducts
      .filter((item) => item.bestseller && item.quantity > 0)
      .slice(0, 2);

    const bestCeramicProducts = ceramicProducts
      .filter((item) => item.bestseller && item.quantity > 0)
      .slice(0, 3);

    setBestSellerProducts([...bestMarbleProducts, ...bestCeramicProducts]);
  }, [marbleProducts, ceramicProducts]);

  return (
    <div className="mt-5">
      <div className="text-center py-8 text-3xl">
        <Title text1="Best " text2="Sellers" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Elegantly crafted marble and ceramic sculptures, blending tradition
          with artistry.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <ProductItemSkeleton key={index} />
            ))
          : bestSeller.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                sellprice={item.sellprice}
                price={item.price}
                images={item.images}
                quantity={item.quantity}
              />
            ))}
      </div>
    </div>
  );
};

export default BestSeller;
