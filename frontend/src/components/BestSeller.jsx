import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const BestSeller = () => {
  const { marbleProducts, ceramicProducts, showSearch } = useContext(ShopContext);
  const [bestSeller, setbestsellerProduts] = useState([]);

  useEffect(() => {
  if (!marbleProducts.length || !ceramicProducts.length) return;

  const bestMarbleProducts = marbleProducts
    .filter((item) => item.bestseller)
    .slice(19, 21);

  const bestCeramicProducts = ceramicProducts
    .filter((item) => item.bestseller)
    .slice(7, 10);

  setbestsellerProduts([...bestMarbleProducts, ...bestCeramicProducts]);
}, [marbleProducts, ceramicProducts]);


  return (
    <div className="mt-5">
      <div className="text-center py-8 text-3xl">
        <Title text1={"Best "} text2={"Sellers"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Elegantly crafted marble and ceramic sculptures, blending tradition
          with artistry.
        </p>
      </div>
      {/*Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-4 pb-8">
        {(bestSeller.length
          ? bestSeller
          : Array(5).fill(null)
        ).map((item, index) => (
          <ProductItem key={index} loading={!item} {...item} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
