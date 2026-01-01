import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const CartTotal = () => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    getCartSellAmount,
    getCartCount,
  } = useContext(ShopContext);

  const [visible, setVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("place-order")) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 lg:gap-3 mt-2 text-sm md:text-lg">
        <div className="flex justify-between">
          <p>
            Price ({getCartCount()} item{getCartCount() > 1 ? "s" : ""}){" "}
          </p>
          <p>
            {currency}
            {getCartAmount()}.00
          </p>
        </div>
        <hr className="text-gray-200" />
        <div className="flex justify-between">
          <p>Discount</p>
          <p className="text-green-700">
            - {currency}
            {getCartAmount() - getCartSellAmount()}.00
          </p>
        </div>
        <hr className="text-gray-200" />
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {getCartSellAmount()}.00
          </p>
        </div>
        <hr className="text-gray-200" />
        {visible && (
          <div className="flex flex-col gap-2 lg:gap-3">
            <div className="flex justify-between">
              <p>Shipping Fee</p>
              <p>
                {currency}
                {getCartSellAmount() === 0 ? 0 : delivery_fee}.00
              </p>
            </div>
            <hr className="text-gray-200" />
          </div>
        )}

        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {getCartSellAmount() === 0
              ? 0
              : getCartSellAmount() + (visible && delivery_fee)}
            .00
          </b>
        </div>
        {getCartSellAmount() === 0 ? null : (
          <div className="flex bg-iceberg p-2 gap-2 text-sm text-genoa font-medium rounded-md justify-center items-center">
            <img className="w-4" src={assets.discount_icon} alt="discount" />{" "}
            <p className="text-genoa">
              Nice Your total discount is {currency}
              {getCartAmount() - getCartSellAmount()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTotal;
