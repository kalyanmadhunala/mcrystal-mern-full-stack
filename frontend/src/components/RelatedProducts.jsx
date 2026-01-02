import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";
import RelatedProductsSkeleton from "./RelatedProductsSkeleton";

const RelatedProducts = ({ id, material, category, subcategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!products.length) return;

    setLoading(true);

    const filtered = products.filter(
      (item) =>
        item._id !== id &&
        item.material === material &&
        item.category === category &&
        item.subcategory === subcategory
    );

    setRelated(filtered.slice(0, 5));
    setLoading(false);
  }, [products, id, material, category, subcategory]);

  if (loading) {
    return <RelatedProductsSkeleton />;
  }

  if (!related.length) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="text-center mb-6">
        <Title text1="RELATED " text2="PRODUCTS" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((item) => (
          <ProductItem
            key={item._id}
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

export default RelatedProducts;
