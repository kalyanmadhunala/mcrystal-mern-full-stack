import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

/**
 * ResponsiveFabPortal
 * - Renders a floating Home button into document.body via portal
 * - top-left on small/medium, bottom-left on large screens
 * - immune to ancestor transforms because it's attached to body
 */

export default function ResponsiveFabPortal({ className = "" }) {
  const [isLarge, setIsLarge] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 1024px)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsLarge(e.matches);

    // modern API
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    // cleanup
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // do not render on SSR
  if (typeof document === "undefined") return null;

  const wrapper = (
    <Link
      to="/"
      aria-label="Go to home"
      title="Home"
      className={`
        fixed z-[9999]
        ${isLarge ? "bottom-6 left-6" : "top-6 left-6"}
        w-12 h-12 rounded-full flex items-center justify-center
        lg:bg-white/80 backdrop-blur-md
        shadow-lg shadow-black/20
        border border-white/40
        bg-white
        hover:scale-110 hover:bg-white transition-all
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}
      `}
    >
      <img
        src={assets.home_icon || assets.home || "/icons/home.svg"}
        alt="Home"
        className="w-6 h-6 pointer-events-none"
      />
    </Link>
  );

  return createPortal(wrapper, document.body);
}
