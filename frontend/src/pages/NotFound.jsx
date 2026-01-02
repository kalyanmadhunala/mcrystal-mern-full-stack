import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    const title = "Not Found";
    document.title = title + " | M Crystal";
  }, []);
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <img
        className="w-fit h-100"
        src="https://res.cloudinary.com/dbanrkx7w/image/upload/w_auto,dpr_auto,f_auto,q_auto/notfound"
        alt="notfound"
      />
      <p className="text-2xl font-semibold text-center text-gray-900">
        Page Not Found
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 text-sm sm:text-base bg-primary text-white rounded-xl cursor-pointer
                   shadow-md hover:bg-secondary transition-all duration-300 active:scale-95"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
