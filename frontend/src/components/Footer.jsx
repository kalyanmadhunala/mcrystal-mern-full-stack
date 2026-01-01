import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {

  const [footerVisible, setFooterVisible] = useState(true);
  const location = useLocation();


  useEffect(() => {
        if (location.pathname.includes("login") || location.pathname.includes("signup") || location.pathname.includes("set-password") ||
      location.pathname.includes("forgot-password")) {
          setFooterVisible(false)
        } else {
          setFooterVisible(true)
        }
    },[location])

  return footerVisible &&  (
    <div className="my-10 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-12 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-52" alt="" />
          <p className="w-full md:w-2/3 text-gray-600">
            Explore our collection of marble and ceramic sculptures, crafted
            with superior quality materials. Each piece reflects timeless
            beauty, unmatched craftsmanship, and our commitment to delivering
            lasting elegance and customer satisfaction.
          </p>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/" className="hover:text-secondary cursor-pointer">
                Home
              </Link>
            </li>
            <li>
              <Link to="/marbleware" className="hover:text-secondary cursor-pointer">
                Marbleware
              </Link>
            </li>
            <li>
              <Link to="/ceramicware" className="hover:text-secondary cursor-pointer">
                Ceramicware
              </Link>
            </li>
            <li>
              <Link to="/premium-collections" className="hover:text-secondary cursor-pointer">
                Premium Collections
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-secondary cursor-pointer">
                About
              </Link>
            </li>
            <li>
              <Link to="/delivery" className="hover:text-secondary cursor-pointer">
                Delivery
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">MARBLEWARE</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/marbleware/bathware" className="hover:text-secondary cursor-pointer">
                Bathware
              </Link>
            </li>
            <li>
              <Link to="/marbleware/designer-collection" className="hover:text-secondary cursor-pointer">
                Designer Collection
              </Link>
            </li>
            <li>
              <Link to="/marbleware/devotional-collection" className="hover:text-secondary cursor-pointer">
                Devotional Collection
              </Link>
            </li>
            <li>
              <Link to="/marbleware/home-decors" className="hover:text-secondary cursor-pointer">
                Home Decors
              </Link>
            </li>
            <li>
              <Link to="/marbleware/kitchenware" className="hover:text-secondary cursor-pointer">
                Kitchenware
              </Link>
            </li>
            <li>
              <Link to="/marbleware/pooja-collection" className="hover:text-secondary cursor-pointer">
                Pooja Collection
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">CERAMICWARE</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>
              <Link to="/ceramicware/bathware" className="hover:text-secondary cursor-pointer">
                Bathware
              </Link>
            </li>
            <li>
              <Link to="/ceramicware/drinkware" className="hover:text-secondary cursor-pointer">
                Drinkware
              </Link>
            </li>

            <li>
              <Link to="/ceramicware/home-decors" className="hover:text-secondary cursor-pointer">
                Home Decors
              </Link>
            </li>
            <li>
              <Link to="/ceramicware/kitchenware" className="hover:text-secondary cursor-pointer">
                Kitchenware
              </Link>
            </li>
            <li>
              <Link to="/ceramicware/serveware" className="hover:text-secondary cursor-pointer">
                Serveware
              </Link>
            </li>
            <li>
              <Link to="/ceramicware/tableware" className="hover:text-secondary cursor-pointer">
                Tableware
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xl font-medium mb-5">GET IT TOUCH</p>
          <ul className="flex flex-col gap-1 text-gray-600">
            <li>0878-4071147</li>
            <li>contact@mcrystal.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="flex flex-col sm:grid grid-cols-[3fr_3fr_3fr] sm:gap-14">
        <p className="py-5 text-sm text-center">
          Copyright © 2026 M Crystal. All rights reserved.
        </p>
        <Link to="https://maps.app.goo.gl/HFyqtbwhej61fqqP6" target="_blank">
          <p className="py-5 text-sm text-center">
            Shri Manjunatha Marble & Granites
          </p>
        </Link>
        <ul className="py-5 text-sm justify-center text-center flex flex-row gap-2 text-gray-600">
          <li>
            <Link to="/privacy-policy" className="hover:text-black cursor-pointer">
              Privacy Policy |
            </Link>
          </li>
          <li>
            <Link to="/terms-and-conditions" className="hover:text-black cursor-pointer">
              Terms & Conditions
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
