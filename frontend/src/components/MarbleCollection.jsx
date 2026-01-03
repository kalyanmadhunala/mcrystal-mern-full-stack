import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ProductItemSkeleton from "./ProductItemSkeleton";

const MarbleCollection = () => {
  const { marbleProducts = [] } = useContext(ShopContext);

  const [exclusiveProducts, setExclusiveProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!marbleProducts.length) return;

    const marbleExclusive = marbleProducts.filter(
      (item) => item.exculsiveItem && item.quantity > 0
    );

    setExclusiveProducts(marbleExclusive.slice(0, 5));
    setLoading(false);
  }, [marbleProducts]);

  return (
    <div className="mt-5">
      <div className="text-center py-8 text-3xl">
        <Title text1="Marble " text2="Exclusives" />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Elegantly crafted marble collections, blending tradition with artistry.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <ProductItemSkeleton key={index} />
            ))
          : exclusiveProducts.map((item) => (
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

export default MarbleCollection;
