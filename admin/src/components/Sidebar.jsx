import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Ripple from "./RippleButton";

const Sidebar = () => {

  return (
    <div className="w-[18%] min-h-screen border-r-2 border-gray-200">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <Ripple>
          <NavLink
            className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-sm"
            to="/add"
          >
            <img className="w-5 h-5" src={assets.add_icon} alt="add" />
            <p className="hidden md:block ">Add Items</p>
          </NavLink>
        </Ripple>
        <Ripple>
          <NavLink
            className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-sm"
            to="/list"
          >
            <img className="w-5 h-5" src={assets.order_icon} alt="add" />
            <p className="hidden md:block ">List Items</p>
          </NavLink>
        </Ripple>
        <Ripple>
          <NavLink
            className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-3 rounded-sm"
            to="/orders"
          >
            <img className="w-5 h-5" src={assets.parcel_icon} alt="add" />
            <p className="hidden md:block ">Orders</p>
          </NavLink>
        </Ripple>
      </div>
    </div>
  );
};

export default Sidebar;
