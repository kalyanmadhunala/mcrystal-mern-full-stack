import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const SearchBar = () => {
  const { search, setSearch, setShowSearch, showSearch } =
    useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes("marbleware") ||
      location.pathname.includes("ceramicware") ||
      location.pathname.includes("premium")
    ) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [location]);

  return visible && showSearch ? (
    <div className="flex items-center justify-center border-gray-300 border-t border-b bg-gray-50 text-center mt-16">
      <div className="inline-flex items-center justify-center border gap-2 border-gray-400 px-5 py-2 mx-3 my-5 rounded-full w-3/4 sm:w-1/2">
        <img className="w-4" src={assets.search_icon} alt="search" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="text"
          placeholder="Search"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-gray-400 hover:text-black"
          >
            Clear
          </button>
        )}        
      </div>
      <img
        onClick={() => {
          setShowSearch(false), setSearch("");
        }}
        className="inline w-3 cursor-pointer"
        src={assets.cross_icon}
        alt="cross"
      />
    </div>
  ) : null;
};

export default SearchBar;
