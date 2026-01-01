import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import RippleButton from "./RippleButton";
import Ripple from "./RippleButton";

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const onClickHandle = () => {
    setToken("");
    toast.success("Logged Out Successfully");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between px-[4%] py-2">
      <img
        className="w-[max(12%,80px)]"
        src={assets.mcrystaladmin_logo}
        alt="admin_panel_logo"
      />
      <Ripple className="cursor-pointer">
        <button
          onClick={onClickHandle}
          className="bg-primary text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm cursor-pointer"
        >
          Logout
        </button>
      </Ripple>
    </div>
  );
};

export default Navbar;
