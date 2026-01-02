import React, { useContext, useEffect, useState, useCallback } from "react";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useParams } from "react-router-dom";

const Marbleware = () => {
  const { subcategory } = useParams();
  const { marbleProducts = [], search, showSearch } = useContext(ShopContext);

  const [filteredProducts, setfilteredProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState("relevent");
  const [uiLoading, setUiLoading] = useState(true);

  // price slider / input state
  const [priceMinLimit, setPriceMinLimit] = useState(0);
  const [priceMaxLimit, setPriceMaxLimit] = useState(1000);

  // applied filter values (used for filtering products)
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);

  // editable inputs (user types here, only applied when they click Set)
  const [inputMin, setInputMin] = useState(0);
  const [inputMax, setInputMax] = useState(1000);

  // NEW: tag filter state
  const [isBestSellerOnly, setIsBestSellerOnly] = useState(false);
  const [isPremiumOnly, setIsPremiumOnly] = useState(false);
  const [isPremiumBestOnly, setIsPremiumBestOnly] = useState(false);
  const [isOutofstock, setIsOutofStock] = useState(false);

  const formatTitle = (slug) => {
    if (!slug) return "ALL MARBLEWARE";
    return slug
      .replace(/-and-/gi, " & ")
      .replace(/-or-/gi, " / ")
      .replace(/-/g, " ")
      .toUpperCase();
  };

  const formatFilterTitle = (slug) => {
    if (!slug) return "All Marbleware";
    return slug
      .replace(/-and-/gi, " & ")
      .replace(/-or-/gi, " / ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // change tab title when route changes
  useEffect(() => {
    const title = formatFilterTitle(subcategory) || "Marbleware";
    document.title = title + " - Marbleware | M Crystal";
  }, [subcategory]);

  // compute baseProducts depending on whether a subcategory is active
  const getBaseProducts = useCallback(() => {
    if (!marbleProducts || marbleProducts.length === 0) return [];
    if (!subcategory) return marbleProducts;
    setUiLoading(false);
    return marbleProducts.filter(
      (item) =>
        item.subCategory === subcategory || item.category === subcategory
    );
  }, [marbleProducts, subcategory]);

  // ALWAYS reset limits, inputs, and tag filters to the current scope min/max when scope changes
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
      setIsPremiumOnly(false);
      setIsPremiumBestOnly(false);
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
      setInputMax(1000);
      setIsBestSellerOnly(false);
      setIsPremiumOnly(false);
      setIsPremiumBestOnly(false);
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

    // also reset tag filters when changing category/subcategory
    setIsBestSellerOnly(false);
    setIsPremiumOnly(false);
    setIsPremiumBestOnly(false);
  }, [getBaseProducts]);


  const applyFilter = () => {
    let base = marbleProducts || [];

    if (subcategory) {
      base = base.filter(
        (item) =>
          item.subCategory === subcategory || item.category === subcategory
      );
    }

    //out of stock logic
    if (!isOutofstock) {
      base = base.filter((item) => item.quantity > 0);
    }

    //search logic
    if (showSearch && search) {
      const terms = search.toLowerCase().trim().split(/\s+/); // split by spaces

      base = base.filter((item) => {
        const name = item.name.toLowerCase();
        // every word the user typed must be found in the name
        return terms.every((term) => name.includes(term));
      });
    }

    const filtered = base.filter((item) => {
      const price = parseFloat(item.sellprice);
      if (!Number.isFinite(price)) return false;

      // price filter
      if (price < priceMin || price > priceMax) return false;

      // tag filters
      const isBest = !!item.bestseller;
      const isPremium = !!item.premiumItem;
      const isPremiumBest = isBest && isPremium;

      // if none checked → no tag restriction
      if (!isBestSellerOnly && !isPremiumOnly && !isPremiumBestOnly) {
        return true;
      }

      let matches = false;

      if (isBestSellerOnly && isBest) matches = true;
      if (isPremiumOnly && isPremium) matches = true;
      if (isPremiumBestOnly && isPremiumBest) matches = true;

      if (!matches) return false;
      return matches;
    });

    setfilteredProducts(filtered);
  };

  // filtering: category/subcategory + applied priceMin/priceMax + bestseller/premium
  useEffect(() => {
    applyFilter();
  }, [
    search,
    showSearch,
    marbleProducts,
    subcategory,
    priceMin,
    priceMax,
    isBestSellerOnly,
    isPremiumOnly,
    isPremiumBestOnly,
    isOutofstock,
  ]);

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

  //Clear handler
  const handleClear = () => {
    setPriceMin(priceMinLimit);
    setPriceMax(priceMaxLimit);
    setInputMin(priceMinLimit);
    setInputMax(priceMaxLimit);
    setIsBestSellerOnly(false);
    setIsPremiumOnly(false);
    setIsPremiumBestOnly(false);
    setIsOutofStock(false)
    setSortType("relevent");
  };

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

          {/* SubCategory filter*/}
          <div
            className={`border border-gray-400 pl-5 py-3 mt-6 ${
              showFilter ? "" : "hidden"
            } sm:block`}
          >
            <p className="mb-3 text-sm font-medium">
              In {formatFilterTitle(subcategory)}
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
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  checked={isPremiumOnly}
                  onChange={(e) => setIsPremiumOnly(e.target.checked)}
                />
                Premium Collection
              </p>
              <p className="flex gap-2">
                <input
                  className="w-3"
                  type="checkbox"
                  checked={isPremiumBestOnly}
                  onChange={(e) => setIsPremiumBestOnly(e.target.checked)}
                />
                Premium Best Sellers
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
            <Title text2={formatTitle(subcategory)} />
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
            {uiLoading ? (
              
              Array.from({ length: 8 }).map((_, index) => (
                <ProductItem key={index} loading />
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <ProductItem
                  key={item._id ?? index}
                  name={item.name}
                  id={item._id}
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

export default Marbleware;
