import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CeramicCollection from "../components/CeramicCollection";
import PremiumBanner from "../components/PremiumBanner";
import BestSeller from "../components/BestSeller";
import OurPolicy from "../components/OurPolicy";
import NewsletterBox from "../components/NewsletterBox";
import MarbleCollection from "../components/MarbleCollection";
import { assets } from "../assets/assets";

/**
 * Behavior:
 * - localStorage key "mcrystal_splash_seen" remembers if splash has ever been shown
 * - session cookie "mcrystal_session" exists while the browser process is running
 * - Show splash if: NOT seen ever OR session cookie is missing (browser restarted)
 * - If splash shows: after fade, set localStorage and set session cookie
 */

const SESSION_COOKIE_NAME = "mcrystal_session";
const SPLASH_KEY = "mcrystal_splash_seen";

// helpers (safe for SSR)
const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const setSessionCookie = (name, value = "1") => {
  if (typeof document === "undefined") return;
  // session cookie: no expires or max-age -> cleared on full browser close
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
};

const Home = () => {
  // synchronous checks to avoid FOUC
  const sessionExists =
    typeof window !== "undefined" ? !!getCookie(SESSION_COOKIE_NAME) : false;
  const splashSeen =
    typeof window !== "undefined" ? !!localStorage.getItem(SPLASH_KEY) : false;

  // show if never seen OR browser session cookie missing (browser was closed)
  const shouldShowSplash = !splashSeen || !sessionExists;

  const [splashVisible, setSplashVisible] = useState(() => shouldShowSplash);
  const [fadeOut, setFadeOut] = useState(false);
  const [homeVisible, setHomeVisible] = useState(() => !shouldShowSplash);

  useEffect(() => {
    document.title = "Home | M Crystal";
  }, []);

  useEffect(() => {
    if (!splashVisible) return;

    // prevent scroll while splash visible
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setFadeOut(true), 4000);

    const removeTimer = setTimeout(() => {
      setSplashVisible(false);
      // persist that splash was seen (until you manually clear it)
      try {
        localStorage.setItem(SPLASH_KEY, "true");
      } catch (e) {
        // ignore storage errors
      }

      // ensure session cookie exists for this browser session
      try {
        setSessionCookie(SESSION_COOKIE_NAME, "1");
      } catch (e) {}

      // restore scroll
      document.body.style.overflow = prevOverflow || "";
    }, 4300);

    const showHome = setTimeout(() => {
      setHomeVisible(true);
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      clearTimeout(showHome);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [splashVisible]);

  return (
    <div>
      {/* Splash Screen */}
      {splashVisible && (
        <div
          className={`
      fixed inset-0 z-50 bg-white flex items-center justify-center
      transition-opacity duration-800 ease-out
      ${fadeOut ? "opacity-0" : "opacity-100"}
    `}
        >
          <video
            autoPlay
            muted
            playsInline
            loop // ← this makes it loop infinitely
            className="max-w-full max-h-full object-contain"
          >
            <source
              src="https://res.cloudinary.com/dbanrkx7w/image/upload/f_mp4/v1767339690/mcrystalanima_w_bg.gif"
              type="video/mp4"
            />
            {/* Reliable fallback if video autoplay is blocked */}
            <img
              src="https://res.cloudinary.com/dbanrkx7w/image/upload/q_auto,f_auto/v1767339690/mcrystalanima_w_bg.gif"
              alt="Splash animation"
              className="max-w-full max-h-full object-contain"
            />
          </video>
        </div>
      )}

      {/* Main content - only mounted when ready to avoid FOUC */}
      {homeVisible && (
        <div>
          <Hero />
          <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
            <MarbleCollection />
            <CeramicCollection />
          </div>
          <PremiumBanner />
          <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
            <BestSeller />
            <OurPolicy />
            <NewsletterBox />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
