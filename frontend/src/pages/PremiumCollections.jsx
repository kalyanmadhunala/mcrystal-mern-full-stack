import React, { useContext, useEffect, useState, useCallback } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const PremiumCollections = () => {
  const {
    premiumCollection = [],
    search,
    setSearch,
    showSearch,
    setShowSearch,
  } = useContext(ShopContext);

  const [filteredProducts, setfilteredProducts] = useState([]);
  const [material, setMaterial] = useState("marble");

  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState("relevent");
  const [isOutofstock, setIsOutofStock] = useState(false);

  // price slider / input state
  const [priceMinLimit, setPriceMinLimit] = useState(0);
  const [priceMaxLimit, setPriceMaxLimit] = useState(1000);

  // applied filter values (used for filtering products)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // editable inputs (user types here, only applied when they click Set)
  const [inputMin, setInputMin] = useState(0);
  const [inputMax, setInputMax] = useState(1000);

  // tag filter state
  const [isBestSellerOnly, setIsBestSellerOnly] = useState(false);

  const formatFilterTitle = (slug) => {
    if (!slug) return "All Premium Collections";
    return slug
      .replace(/-and-/gi, " & ")
      .replace(/-or-/gi, " / ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // tab title
  useEffect(() => {
    const title = "Premium Collections";
    document.title = title + " | M Crystal";
  }, []);

  // base products for current category
  const getBaseProducts = useCallback(() => {
    if (!premiumCollection || premiumCollection.length === 0) return [];
    if (!material) return premiumCollection;
    return premiumCollection.filter((item) => item.material === material);
  }, [premiumCollection, material]);

  // reset limits + inputs when category or data changes
  useEffect(() => {
    const base = getBaseProducts();

    if (!base || base.length === 0) {
      setPriceMinLimit(0);
      setPriceMaxLimit(1000);
      setPriceMin(0);
      setPriceMax(1000);
      setInputMin(0);
      setInputMax(1000);
      setIsBestSellerOnly(false);
      return;
    }

    const prices = base
      .map((p) => {
        const v = parseFloat(p.sellprice);
        return Number.isFinite(v) ? v : NaN;
      })
      .filter((v) => !Number.isNaN(v));

    if (prices.length === 0) {
      setPriceMinLimit(0);
      setPriceMaxLimit(1000);
      setPriceMin(0);
      setPriceMax(1000);
      setInputMin(0);
      setInputMax(0);
      setIsBestSellerOnly(false);
      return;
    }

    const min = Math.floor(Math.min(...prices));
    const max = Math.ceil(Math.max(...prices));

    setPriceMinLimit(min);
    setPriceMaxLimit(max);
    setPriceMin(min);
    setPriceMax(max);
    setInputMin(min);
    setInputMax(max);
    setIsBestSellerOnly(false);
  }, [getBaseProducts]);

  // apply filters every time deps change
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    premiumCollection,
    material,
    priceMin,
    priceMax,
    isBestSellerOnly,
    isOutofstock,
  ]);

  const applyFilter = () => {
    let base = premiumCollection || [];

    if (showSearch && search) {
      const terms = search.toLowerCase().trim().split(/\s+/); // split by spaces

      base = base.filter((item) => {
        const name = item.name.toLowerCase();
        // every word the user typed must be found in the name
        return terms.every((term) => name.includes(term));
      });
    }

    // category filter
    if (material) {
      base = base.filter((item) => item.material === material);
    }
    //out of stock logic
    if (!isOutofstock) {
      base = base.filter((item) => item.quantity > 0);
    }

    const filtered = base.filter((item) => {
      const price = parseFloat(item.sellprice);
      if (!Number.isFinite(price)) return false;

      // price filter
      if (price < priceMin || price > priceMax) return false;

      // Best seller filter
      const isBest = !!item.bestseller;

      if (!isBestSellerOnly) {
        return true; // no tag filter
      }

      // when checkbox ON -> must be bestseller
      return isBest;
    });

    setfilteredProducts(filtered);
  };

  // Apply handler for Set button: validate/clamp then set applied values
  const handleSetPrice = () => {
    let min = Number(inputMin);
    let max = Number(inputMax);

    if (Number.isNaN(min)) min = priceMinLimit;
    if (Number.isNaN(max)) max = priceMaxLimit;

    min = Math.max(priceMinLimit, Math.min(min, priceMaxLimit));
    max = Math.max(priceMinLimit, Math.min(max, priceMaxLimit));

    if (min >= max) {
      if (min > priceMinLimit) {
        min = Math.max(priceMinLimit, max - 1);
      } else if (max < priceMaxLimit) {
        max = Math.min(priceMaxLimit, min + 1);
      } else {
        min = priceMinLimit;
        max = priceMinLimit + 1;
      }
    }

    setPriceMin(min);
    setPriceMax(max);
    setInputMin(min);
    setInputMax(max);
    setSortType("relevent");
  };

  // Reset handler
  const handleReset = () => {
    setPriceMin(priceMinLimit);
    setPriceMax(priceMaxLimit);
    setInputMin(priceMinLimit);
    setInputMax(priceMaxLimit);
    setSortType("relevent");
  };

  // Clear all filters
  const handleClear = () => {
    setMaterial("marble");
    setPriceMin(priceMinLimit);
    setPriceMax(priceMaxLimit);
    setInputMin(priceMinLimit);
    setInputMax(priceMaxLimit);
    setIsBestSellerOnly(false);
    setSortType("relevent");
  };

  // sort by price
  const sortProducts = () => {
    const fCopy = filteredProducts.slice();

    switch (sortType) {
      case "low-high":
        setfilteredProducts(fCopy.sort((a, b) => a.sellprice - b.sellprice));
        break;
      case "high-low":
        setfilteredProducts(fCopy.sort((a, b) => b.sellprice - a.sellprice));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    sortProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType]);

  const props = getBaseProducts()
  const OutOff = props.filter((item) => item.quantity === 0).length

  return (
    <div
      className={`${
        showSearch ? "" : "mt-10"
      } px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]`}
    >
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">
        {/* Filter Options */}
        <div className="min-w-60">
          <div className="flex items-center justify-between gap-5">
            <p
              onClick={() => setShowFilter(!showFilter)}
              className="my-2 text-xl flex items-center sm:cursor-pointer md:pointer-events-none gap-2"
            >
              FILTERS
              <img
                className={`h-3 sm:hidden transform transition-transform duration-200 ${
                  showFilter ? "rotate-180" : ""
                } `}
                src={assets.dropdown_icon}
                alt=""
              />
            </p>
            <p
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-black cursor-pointer"
            >
              Clear
            </p>
          </div>

          {/* Category Filter */}
          <div
            className={`border border-gray-400 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Material</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <label className="flex gap-2 items-center cursor-pointer">
                <input
                  className="w-3"
                  type="radio"
                  name="premium-category"
                  checked={material === "marble"}
                  onChange={() => {
                    setMaterial("marble"), setShowSearch(false), setSearch("");
                  }}
                />
                Marbleware
              </label>
              <label className="flex gap-2 items-center cursor-pointer">
                <input
                  className="w-3"
                  type="radio"
                  name="premium-category"
                  checked={material === "ceramic"}
                  onChange={() => {
                    setMaterial("ceramic"), setShowSearch(false), setSearch("");
                  }}
                />
                Ceramicware
              </label>
            </div>
          </div>

          {/* Price Range */}
          <div
            className={`border border-gray-400 px-3 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">Price Range</p>

            <div className="relative px-2">
              <div className="flex items-center justify-between mt-3">
                <label className="text-xs text-gray-500">Min</label>
                <input
                  type="number"
                  value={inputMin}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setInputMin("");
                      return;
                    }
                    const n = Number(val);
                    setInputMin(Number.isNaN(n) ? "" : n);
                  }}
                  className="w-20 border rounded px-2 py-1 text-sm"
                />

                <label className="text-xs text-gray-500">Max</label>
                <input
                  type="number"
                  value={inputMax}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setInputMax("");
                      return;
                    }
                    const n = Number(val);
                    setInputMax(Number.isNaN(n) ? "" : n);
                  }}
                  className="w-20 border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="flex flex-col justify-between pt-3 gap-2">
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      handleSetPrice();
                      setShowFilter(!showFilter);
                    }}
                    className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-gray-600"
                    type="button"
                  >
                    Set
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 text-sm border rounded-lg text-black hover:bg-gray-200"
                    type="button"
                  >
                    Reset
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>Lowest Price: ₹{priceMinLimit}</span>
                    <span>Highest Price: ₹{priceMaxLimit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Seller filter */}
          <div
            className={`border border-gray-400 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">
              In {formatFilterTitle(material)}ware
            </p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  checked={isBestSellerOnly}
                  onChange={(e) => setIsBestSellerOnly(e.target.checked)}
                />
                Best Sellers
              </p>
              {OutOff > 0 && (<p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  checked={isOutofstock}
                  onChange={(e) => setIsOutofStock(e.target.checked)}
                />
                Include Out of Stock ({OutOff})
              </p>)}
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text2={"PREMIUM COLLECTIONS"} />
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="border-2 border-gray-300 text-sm px-2"
              id="pricesort"
            >
              <option value="relevent">Sort by: Relevent</option>
              <option value="low-high">Sort by: Low-High</option>
              <option value="high-low">Sort by: High-Low</option>
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <ProductItem
                  key={item._id ?? index}
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
                No products found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCollections;
