import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import ProductItemSkeleton from "../components/ProductItemSkeleton";

const Wishlist = () => {
  const {
    products = [],
    wishlist = {},
    search,
    showSearch,
  } = useContext(ShopContext);

  const [material, setMaterial] = useState("all");
  const [sortType, setSortType] = useState("relevent");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [uiLoading, setUiLoading] = useState(true);

  /* Page title */
  useEffect(() => {
    document.title = "Wishlist | M Crystal";
  }, []);

  /* Get wishlist products */
  const wishlistProducts = useMemo(() => {
    if (!products.length) return [];
    return products.filter((item) => wishlist[item._id]);
  }, [products, wishlist]);

  /* Simulated loading (smooth UX) */
  useEffect(() => {
    setUiLoading(true);
    const timer = setTimeout(() => setUiLoading(false), 300);
    return () => clearTimeout(timer);
  }, [wishlistProducts]);

  /* Apply filters + sort */
  useEffect(() => {
    let base = [...wishlistProducts];

    // Search filter
    if (showSearch && search) {
      const terms = search.toLowerCase().trim().split(/\s+/);
      base = base.filter((item) =>
        terms.every((term) => item.name.toLowerCase().includes(term))
      );
    }

    // Material filter
    if (material !== "all") {
      base = base.filter((item) => item.material === material);
    }

    // Sorting
    if (sortType === "low-high") {
      base.sort((a, b) => a.sellprice - b.sellprice);
    } else if (sortType === "high-low") {
      base.sort((a, b) => b.sellprice - a.sellprice);
    }

    setFilteredProducts(base);
  }, [wishlistProducts, search, showSearch, material, sortType]);

  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="text-center py-5 text-3xl">
          <Title text2="MY WISHLIST" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Material Filter */}
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={material === "all"}
                onChange={() => setMaterial("all")}
              />
              All
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={material === "marble"}
                onChange={() => setMaterial("marble")}
              />
              Marble
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={material === "ceramic"}
                onChange={() => setMaterial("ceramic")}
              />
              Ceramic
            </label>
          </div>

          {/* Sort Filter */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 text-sm px-4 py-2"
          >
            <option value="relevent">Sort by: Relevent</option>
            <option value="low-high">Sort by: Low–High</option>
            <option value="high-low">Sort by: High–Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {uiLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              sellprice={item.sellprice}
              price={item.price}
              images={item.images}
              quantity={item.quantity}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Your wishlist is empty ❤️
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
