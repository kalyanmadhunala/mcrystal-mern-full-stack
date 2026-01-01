import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const CeramicCollection = () => {
  const { ceramicProducts } = useContext(ShopContext);
  const [exculsiveProducts, setExculsiveProducts] = useState([]);

  

  useEffect(() => {
  if (!ceramicProducts.length) return;

  const ceramicExculsive = ceramicProducts.filter(
    (item) => item.exculsiveItem
  );

  setExculsiveProducts(ceramicExculsive.slice(0, 5));
}, [ceramicProducts]);


  return (
    <div className="mt-5">
      <div className="text-center py-8 text-3xl">
        <Title text1={"Ceramic "} text2={"Exclusives"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Elegantly crafted ceramic collections, blending tradition with artistry.
        </p>
      </div>
      {/*Rendering products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-4">
        {exculsiveProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            images={item.images}
            name={item.name}
            sellprice={item.sellprice}
            price={item.price}
            quantity={item.quantity}
          />
        ))}

      </div>
    </div>
  );
};

export default CeramicCollection;
