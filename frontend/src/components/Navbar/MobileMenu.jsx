// src/components/Navbar/MobileMenu.jsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { menuData, slugify } from "./menuData";
import { assets } from "../../assets/assets";

const MobileMenu = ({ isOpen, close }) => {
  // which main category is expanded: "marbleware" | "ceramicware" | null
  const [expandedWare, setExpandedWare] = useState(null);
  
  // which heading is expanded inside each ware (by title)
  const [expandedHeading, setExpandedHeading] = useState({
    marbleware: null,
    ceramicware: null,
  });

  const toggleWare = (wareKey) => {
    setExpandedWare((prev) => (prev === wareKey ? null : wareKey));
    // optionally collapse heading when closing main ware
    setExpandedHeading((prev) =>
      prev[wareKey] ? { ...prev, [wareKey]: null } : prev
    );
  };

  const toggleHeading = (wareKey, headingTitle) => {
    setExpandedHeading((prev) => ({
      ...prev,
      [wareKey]: prev[wareKey] === headingTitle ? null : headingTitle,
    }));
  };

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        onClick={() => {
          close(), setExpandedWare(null);
        }}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-40" : "opacity-0"
        }`}
      />

      {/* Side Panel */}
      <aside
        className={`absolute top-0 bottom-0 w-3/4 bg-white shadow-lg transform transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Link
            to="/"
            onClick={() => {
              close(),
                setExpandedWare(null),
                setExpandedHeading({
                  marbleware: null,
                  ceramicware: null,
                });
            }}
          >
            <img src={assets.logo} className="h-8" alt="logo" />
          </Link>
          <button
            onClick={() => {
              close(),
                setExpandedWare(null),
                setExpandedHeading({
                  marbleware: null,
                  ceramicware: null,
                });
            }}
            aria-label="Close menu"
          >
            <img src={assets.cross_icon} className="h-3" alt="close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 h-[calc(100%-64px)] overflow-y-auto">
          {/* Home */}
          <NavLink
            to="/"
            onClick={() => {
              close(),
                setExpandedWare(null),
                setExpandedHeading({
                  marbleware: null,
                  ceramicware: null,
                });
            }}
            className="block py-2 text-md font-medium"
          >
            Home
          </NavLink>

          {/* Marbleware */}
          <div className="">
            <button
              onClick={() => toggleWare("marbleware")}
              className="w-full flex items-center justify-between py-2 text-left text-md font-medium"
            >
              <span>Marbleware</span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  expandedWare === "marbleware" ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 8l4 4 4-4" />
              </svg>
            </button>

            {/* Marbleware headings accordion */}
            <div
              className={`
                overflow-hidden transition-all duration-300
                ${
                  expandedWare === "marbleware"
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div className="pl-3 border-l border-gray-200">
                {menuData.marbleware.headings.map((h) => (
                  <div key={h.title} className="py-1">
                    {/* Heading row */}
                    <button
                      onClick={() => toggleHeading("marbleware", h.title)}
                      className="w-full flex items-center justify-between py-1 text-left text-md"
                    >
                      <span>{h.title}</span>
                      <svg
                        className={`h-3 w-3 transition-transform ${
                          expandedHeading.marbleware === h.title
                            ? "rotate-90"
                            : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M7 6l6 4-6 4" />
                      </svg>
                    </button>

                    {/* Subcategories under this heading */}
                    <div
                      className={`
                        overflow-hidden transition-all duration-300
                        ${
                          expandedHeading.marbleware === h.title
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <ul className="pl-4 pb-1 text-sm text-gray-700">
                        {h.sub.map((s) => (
                          <li key={s} className="py-1">
                            <Link
                              to={`/marbleware/${slugify(s)}`}
                              onClick={() => {
                                close(),
                                  setExpandedWare(null),
                                  setExpandedHeading({
                                    marbleware: null,
                                    ceramicware: null,
                                  });
                              }}
                              className="block"
                            >
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ceramicware */}
          <div className="">
            <button
              onClick={() => toggleWare("ceramicware")}
              className="w-full flex items-center justify-between py-2 text-left text-md font-medium"
            >
              <span>Ceramicware</span>
              <svg
                className={`h-4 w-4 transition-transform ${
                  expandedWare === "ceramicware" ? "rotate-180" : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 8l4 4 4-4" />
              </svg>
            </button>

            {/* Ceramicware headings accordion */}
            <div
              className={`
                overflow-hidden transition-all duration-300
                ${
                  expandedWare === "ceramicware"
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div className="pl-3 border-l border-gray-200">
                {menuData.ceramicware.headings.map((h) => (
                  <div key={h.title} className="py-1">
                    {/* Heading row */}
                    <button
                      onClick={() => toggleHeading("ceramicware", h.title)}
                      className="w-full flex items-center justify-between py-1 text-left text-md"
                    >
                      <span>{h.title}</span>
                      <svg
                        className={`h-3 w-3 transition-transform ${
                          expandedHeading.ceramicware === h.title
                            ? "rotate-90"
                            : ""
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M7 6l6 4-6 4" />
                      </svg>
                    </button>

                    {/* Subcategories under this heading */}
                    <div
                      className={`
                        overflow-hidden transition-all duration-300
                        ${
                          expandedHeading.ceramicware === h.title
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <ul className="pl-4 pb-1 text-sm text-gray-700">
                        {h.sub.map((s) => (
                          <li key={s} className="py-1">
                            <Link
                              to={`/ceramicware/${slugify(s)}`}
                              onClick={() => {
                                close(),
                                  setExpandedWare(null),
                                  setExpandedHeading({
                                    marbleware: null,
                                    ceramicware: null,
                                  });
                              }}
                              className="block"
                            >
                              {s}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Collections */}
          <NavLink
            to="/premium-collections"
            onClick={() => {
              close(),
                setExpandedWare(null),
                setExpandedHeading({
                  marbleware: null,
                  ceramicware: null,
                });
            }}
            className="block py-2 text-md font-medium"
          >
            Premium Collections
          </NavLink>

          {/* Wish;ist */}
          <NavLink
            to="/wishlist"
            onClick={() => {
              close(), setExpandedWare(null);
              setExpandedHeading({
                marbleware: null,
                ceramicware: null,
              });
            }}
            className="block py-2 text-md font-medium"
          >
            Wishlist
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            onClick={() => {
              close(), setExpandedWare(null);
              setExpandedHeading({
                marbleware: null,
                ceramicware: null,
              });
            }}
            className="block py-2 text-md font-medium"
          >
            About
          </NavLink>
        </div>
        
      </aside>
    </div>
  );
};

export default MobileMenu;
