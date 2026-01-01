import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import EmptyCart from "../components/EmptyCart";
import { ThreeDots } from "react-loader-spinner";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    loggedin,
    getUserCart,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  // per-product animation state: "in" | "out"
  const [limitAnim, setLimitAnim] = useState({}); // { [id]: "in" | "out" }
  const [limitVisible, setLimitVisible] = useState({});
  const [isVisible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatCategory = (slug) => {
    return slug
      .replace(/-and-/gi, " & ")
      .replace(/-or-/gi, " / ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // build cartData from cartItems
  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const item in cartItems) {
        if (cartItems[item] > 0) {
          tempData.push({
            _id: item,
            quantity: cartItems[item],
          });
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const showLimit = (id) => {
    setLimitVisible((prev) => ({ ...prev, [id]: true }));
    setLimitAnim((prev) => ({ ...prev, [id]: "in" }));
  };

  const hideLimit = (id) => {
    setLimitAnim((prev) => ({ ...prev, [id]: "out" }));
    setTimeout(() => {
      setLimitVisible((prev) => ({ ...prev, [id]: false }));
    }, 900); // matches fade-out duration
  };

  // page title
  useEffect(() => {
    const title = "Your Shopping Cart";
    document.title = title + " | M Crystal";
  }, []);

  const handleCheckOut = () => {
    setLoading(true)
    if (loggedin) {
      setLoading(false)
      navigate("/place-order");
    } else {
      setLoading(false)
      navigate("/login");
    }
  };

  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div className="border-t border-gray-200 pt-14">
        {cartData.length > 0 ? (
          <div>
            <div className="text-2xl mb-3">
              <Title text1={"YOUR"} text2={"CART"} />
            </div>
            {/* Header row - lg and up */}
            <div className="hidden text-gray-500 font-medium lg:grid lg:grid-cols-[1.8fr_1.1fr_0.3fr_0.3fr_0.4fr] lg:items-center mb-2">
              <p className="ml-3">Product</p>
              <p className="text-center">Quantity</p>
              <p className="text-center">Price</p>
              <p className="text-center">Total</p>
              <span></span>
            </div>

            <div className="border-t border-gray-200">
              {cartData.map((item, index) => {
                const productData = products.find(
                  (product) => product._id === item._id
                );
                if (!productData) return null;
                const animState = limitAnim[item._id]; // "in" | "out" | undefined

                return (
                  <div
                    key={index}
                    className="py-4 border-b border-gray-200 px-3 text-gray-700
             flex flex-col gap-3 sm:gap-4
             lg:grid lg:grid-cols-[2fr_1fr_0.3fr_0.3fr_0.4fr] lg:items-center"
                  >
                    {/* Product info */}
                    <a href={`/products/${item._id}`}>
                      <div className="flex items-start gap-4 sm:gap-6">
                        <img
                          className="w-16 sm:w-20 rounded-xl border border-gray-100"
                          src={productData.images[0]}
                          alt={productData.name}
                        />

                        <div>
                          <p className="text-sm sm:text-lg font-medium line-clamp-2 hover:text-secondary">
                            {productData.name}
                          </p>
                          <p className="text-xs sm:text-sm font-medium my-1 sm:my-2 text-gray-500">
                            Material:{" "}
                            <span className="font-normal">
                              {formatCategory(productData.material)}
                            </span>
                          </p>

                          <div className="flex items-center justify-start gap-3">
                            <p className="text-sm sm:text-base font-semibold mt-1">
                              {currency}
                              {productData.sellprice}
                            </p>

                            {/* Info – desktop (fade-in) */}
                            {limitVisible[item._id] && (
                              <div
                                className={`hidden mylg:flex items-center gap-2 max-w-xs transition-all duration-300 ease-out ${
                                  animState === "in" ? "fade-in" : "fade-out"
                                }`}
                              >
                                <img
                                  src={assets.info_icon}
                                  alt="info"
                                  className="w-4 mt-0.5 flex-shrink-0"
                                />
                                <p className="text-xs leading-snug bg-amber-50 border border-amber-200 rounded-md px-2 py-1 text-amber-800">
                                  Uh-oh! Only{" "}
                                  <span className="font-semibold">
                                    {productData.quantity}
                                  </span>{" "}
                                  {productData.quantity === 1
                                    ? "unit is"
                                    : "units are"}{" "}
                                  available right now.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>

                    {/* Quantity – desktop */}
                    <div className="hidden lg:flex items-center justify-center gap-2">
                      {/* - button */}
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item._id, item.quantity - 1);
                          } else {
                            updateQuantity(item._id, 0);
                          }
                          // user decreasing -> fade out
                          hideLimit(item._id);
                        }}
                        className={`w-7 h-7 flex items-center justify-center border rounded-full text-sm 
                      hover:bg-gray-100 active:bg-primary active:text-white
                      ${
                        item.quantity === 1
                          ? "opacity-50 cursor-not-allowed hover:bg-transparent active:bg-transparent"
                          : ""
                      }`}
                        type="button"
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>

                      <p className="min-w-[32px] text-center font-medium">
                        {item.quantity}
                      </p>

                      {/* + button */}
                      <button
                        onClick={() => {
                          if (item.quantity >= productData.quantity) {
                            showLimit(item._id);
                            updateQuantity(item._id, item.quantity + 1);
                            return;
                          }

                          // Increase normally
                          updateQuantity(item._id, item.quantity + 1);
                        }}
                        className={`w-7 h-7 flex items-center justify-center border rounded-full text-sm 
    hover:bg-gray-100 active:bg-primary active:text-white
    ${
      item.quantity >= productData.quantity
        ? "opacity-50 cursor-not-allowed"
        : ""
    }
  `}
                      >
                        +
                      </button>
                    </div>

                    {/* Price – desktop */}
                    <div className="hidden lg:flex items-center justify-end">
                      <p className="font-medium text-gray-400 line-through">
                        {currency}
                        {productData.price * item.quantity}
                      </p>
                    </div>

                    {/* Subtotal – desktop */}
                    <div className="hidden lg:flex items-center justify-end">
                      <p className="font-semibold">
                        {currency}
                        {productData.sellprice * item.quantity}
                      </p>
                    </div>

                    {/* Delete – desktop */}
                    <div className="hidden lg:flex items-center justify-center">
                      <img
                        onClick={() => {
                          updateQuantity(item._id, 0);
                        }}
                        className="w-4 sm:w-5 cursor-pointer opacity-70 hover:opacity-100"
                        src={assets.bin_icon}
                        alt="Remove item"
                      />
                    </div>

                    {/* Quantity + subtotal + delete – mobile / tab */}
                    <div className="flex items-center justify-between gap-3 lg:hidden">
                      <div className="flex items-center gap-2">
                        {/* - button */}
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item._id, item.quantity - 1);
                            } else {
                              updateQuantity(item._id, 0);
                            }
                            hideLimit(item._id);
                            setVisible(false);
                          }}
                          className={`w-7 h-7 flex items-center justify-center border rounded-full text-sm 
    hover:bg-gray-100 active:bg-primary active:text-white
    ${
      item.quantity === 1
        ? "opacity-50 cursor-not-allowed hover:bg-transparent active:bg-transparent"
        : ""
    }`}
                          type="button"
                          disabled={item.quantity === 1}
                        >
                          -
                        </button>

                        <p className="min-w-[32px] text-center font-medium">
                          {item.quantity}
                        </p>

                        {/* + button */}
                        <button
                          onClick={() => {
                            if (item.quantity >= productData.quantity) {
                              setVisible(true);
                              showLimit(item._id);
                              updateQuantity(item._id, item.quantity + 1);
                              return;
                            }
                            // Increase normally
                            updateQuantity(item._id, item.quantity + 1);
                          }}
                          className={`w-7 h-7 flex items-center justify-center border rounded-full text-sm 
    hover:bg-gray-100 active:bg-primary active:text-white
    ${
      item.quantity >= productData.quantity
        ? "opacity-50 cursor-not-allowed"
        : ""
    }
  `}
                        >
                          +
                        </button>
                      </div>

                      {/* Price – mobile & tabs */}

                      <p className="font-medium text-gray-400 line-through">
                        {currency}
                        {productData.sellprice * item.quantity}
                      </p>

                      <p className="font-semibold">
                        {currency}
                        {productData.price * item.quantity}
                      </p>

                      <img
                        onClick={() => updateQuantity(item._id, 0)}
                        className="w-4 sm:w-5 cursor-pointer opacity-70 hover:opacity-100"
                        src={assets.bin_icon}
                        alt="Remove item"
                      />
                    </div>

                    {/* Info – mobile / tablet (fade-in) */}

                    {limitVisible[item._id] && (
                      <div
                        className={`mylg:hidden flex items-center justify-start gap-2 mt-2 max-w-xs transition-all duration-300 ease-out ${
                          animState === "in" ? "fade-in" : "fade-out"
                        }`}
                      >
                        <img
                          src={assets.info_icon}
                          alt="info"
                          className="w-4 mt-0.5 flex-shrink-0"
                        />
                        <p className="text-[11px] leading-snug bg-amber-50 border border-amber-200 rounded-md px-2 py-1 text-amber-800">
                          Uh-oh! Only{" "}
                          <span className="font-semibold">
                            {productData.quantity}
                          </span>{" "}
                          {productData.quantity === 1 ? "unit is" : "units are"}{" "}
                          available right now.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Cart total & checkout */}
            <div className="flex justify-end my-20">
              <div className="w-full sm:w-[450px]">
                <CartTotal />
                <div className="w-full text-end">
                  <button
                    onClick={handleCheckOut}
                    className="bg-primary text-white text-sm hover:text-secondary my-8 px-8 py-3 cursor-pointer"
                  >
                    {loading ? (
                      <ThreeDots
                        visible={true}
                        height="24"
                        width="50"
                        color="#ffffff"
                        radius="9"
                        ariaLabel="three-dots-loading"
                      />
                    ) : (
                      "PROCEED TO CHECKOUT"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCart />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
