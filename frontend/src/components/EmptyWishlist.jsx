import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const EmptyWishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 mt-30 text-center">
      {/* Cart icon + pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-soft"></div>

        <img
          src={assets.package_icon}
          alt="Empty cart"
          className="relative w-18 sm:w-28 md:w-32"
        />
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 animate-fade-slide">
        You haven’t saved anything yet
      </h2>

      {/* Subtitle */}
      <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-md animate-fade-slide">
        Discover handcrafted pieces you’ll love ✨ <br />
Add your favorites to your wishlist.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate("/collections")}
        className="mt-6 px-6 py-3 text-sm sm:text-base bg-primary text-white rounded-xl cursor-pointer
                   shadow-md hover:bg-secondary transition-all duration-300 active:scale-95"
      >
        Explore Collections
      </button>
    </div>
  );
};

export default EmptyWishlist;
