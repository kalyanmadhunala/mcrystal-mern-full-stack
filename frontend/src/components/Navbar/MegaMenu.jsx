// MegaMenu.jsx
import { Link, NavLink } from "react-router-dom";
import { menuData, slugify } from "./menuData";
import { useState } from "react";

const MegaMenu = ({ category, open, onEnter, onLeave }) => {
  const data = category ? menuData[category] : null;

  return (
    // wrapper always mounted so exit animation can run
    <div className="hidden md:block fixed left-0 right-0 top-16 z-40 pointer-events-none">
      <div
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        // slide + fade: max-h animates, plus translate & opacity for polish
        className={`
          mx-auto w-full origin-top transform transition-all duration-600 ease-out
          ${open ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* Animated container */}
        <div
          className={`
            overflow-hidden mx-auto w-full bg-white shadow-xl
             duration-600 ease-out
            ${
              open
                ? "max-h-[100vh] border-t border-gray-200 translate-y-0 pb-10"
                : "max-h-0 -translate-y-3 pb-0"
            }
          `}
        >
          {/* Content (will be visible only when max-h allows it) */}
          {data && (
            <nav>
              <div className="max-w-7xl mx-auto h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-6 overflow-y-auto">
                {data.headings.map((group) => (
                  <div key={group.title} className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <a
                        href={`${data.path}/${slugify(group.title)}`}
                        className="font-semibold text-gray-800"
                      >
                        {group.title}
                      </a>
                    </div>
                    <ul className="flex flex-col gap-1">
                      {group.sub.map((item) => (
                        <li key={item}>
                          <a
                            href={`${data.path}/${slugify(item)}`}
                            className="text-sm text-gray-600 transition transform duration-100 hover:text-black"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
