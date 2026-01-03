import { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import { backendUrl, ShopContext } from "../../context/ShopContext";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const {
    setShowSearch,
    setWishlist,
    getCartCount,
    loggedin,
    setLogin,
    userData,
    setUserData,
    navigate,
  } = useContext(ShopContext);

  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState({ type: "root" });
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const [visible, setVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const location = useLocation();
  const dropdownRef = useRef();

  const closeTimer = useRef(null);
  const menuRef = useRef(null);


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

    if (
      location.pathname.includes("login") ||
      location.pathname.includes("signup") ||
      location.pathname.includes("set-password") ||
      location.pathname.includes("forgot-password")
    ) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY && currentScrollY < 50) {
        setIsScrolled(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDropdownNow = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDropdown(key);
  };

  const scheduleClose = (delay = 180) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(null), delay);
  };

  const handleLogout = async () => {
  try {
    axios.defaults.withCredentials = true;
    const { data } = await axios.post(backendUrl + "/user/logout");

    if (data.success) {
      setLogin(false);
      setUserData(false);
      setWishlist({})
      toast.success(data.msg);
    } else {
      console.log(data.msg);
      toast.error(data.msg);
    }
  } catch (error) {
    toast.error(error.response?.data?.msg || error.message);
  }
};
  return (
    navVisible && (
      <>
        <nav
          className={`fixed top-0 w-full z-50 transition-all ${
            isScrolled ? "shadow-md backdrop-blur-sm rounded-b-4xl" : "bg-white"
          }`}
        >
          <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
            <Link to="/">
              <img src={assets.logo} className="h-10" alt="logo" />
            </Link>

            <ul className="hidden md:flex gap-6 items-center">
              <NavLink className="hover:text-secondary" to="/">
                Home
              </NavLink>

              <li
                onMouseLeave={() => scheduleClose()}
                className="hidden xl:flex flex-row gap-8 p-4"
              >
                <div
                  onMouseEnter={() => openDropdownNow("marbleware")}
                  className="group flex gap-2 items-center justify-between"
                >
                  <NavLink
                    aria-expanded={openDropdown === "marbleware"}
                    className="hover:text-secondary"
                  >
                    Marbleware
                  </NavLink>

                  <img
                    src={assets.dropdown_icon}
                    alt="arrow"
                    className={`w-2 h-2 transform transition-transform duration-200 ${
                      openDropdown === "marbleware" ? "rotate-180" : ""
                    } group-hover:rotate-180`}
                  />
                </div>

                <div
                  onMouseEnter={() => openDropdownNow("ceramicware")}
                  className="group flex gap-2 items-center justify-between"
                >
                  <NavLink
                    aria-expanded={openDropdown === "ceramicware"}
                    className="hover:text-secondary"
                  >
                    Ceramicware
                  </NavLink>

                  <img
                    src={assets.dropdown_icon}
                    alt="arrow"
                    className={`w-2 h-2 transform transition-transform duration-200 ${
                      openDropdown === "ceramicware" ? "rotate-180" : ""
                    } group-hover:rotate-180`}
                  />
                </div>
              </li>
              <li
                onMouseLeave={() => scheduleClose()}
                className="hidden md:flex xl:hidden flex-row gap-8 p-4"
              >
                <div className="group flex gap-2 items-center justify-between">
                  <NavLink
                    aria-expanded={openDropdown === "marbleware"}
                    className="hover:text-secondary"
                    onClick={() =>
                      setOpenDropdown((prev) =>
                        prev === "marbleware" ? null : "marbleware"
                      )
                    }
                  >
                    Marbleware
                  </NavLink>

                  <img
                    src={assets.dropdown_icon}
                    alt="arrow"
                    className={`w-2 h-2 transform transition-transform duration-200 ${
                      openDropdown === "marbleware" ? "rotate-180" : ""
                    } group-hover:rotate-180`}
                  />
                </div>

                <div className="group flex gap-2 items-center justify-between">
                  <NavLink
                    aria-expanded={openDropdown === "ceramicware"}
                    className="hover:text-secondary"
                    onClick={() =>
                      setOpenDropdown((prev) =>
                        prev === "ceramicware" ? null : "ceramicware"
                      )
                    }
                  >
                    Ceramicware
                  </NavLink>

                  <img
                    src={assets.dropdown_icon}
                    alt="arrow"
                    className={`w-2 h-2 transform transition-transform duration-200 ${
                      openDropdown === "ceramicware" ? "rotate-180" : ""
                    } group-hover:rotate-180`}
                  />
                </div>
              </li>
              <NavLink
                className="hover:text-secondary"
                to="/premium-collections"
              >
                Premium Collections
              </NavLink>

              <NavLink className="hover:text-secondary" to="/about">
                About
              </NavLink>
            </ul>

            <div className="flex items-center gap-6">
              {visible && (
                <img
                  className="w-5 cursor-pointer"
                  src={assets.search_icon}
                  alt="profile"
                  onClick={() => setShowSearch(true)}
                />
              )}

              <Link to="/wishlist">
                <img
                  src={assets.wishlist_line_icon}
                  className="w-5 min-w-5"
                  alt="cart"
                />
              </Link>

              {/* -------------------------- Profile Icon ---------------------------------- */}

              <div ref={dropdownRef} className="group relative">
                {loggedin && userData ? (
                  !imgError ? (
                    <img
                      src={userData.picture}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={() => setImgError(true)}
                      onClick={() => setOpen(!open)}
                    />
                  ) : (
                    <div
                      onClick={() => setOpen(!open)}
                      className="cursor-pointer flex justify-center items-center rounded-full bg-primary text-white w-8 h-8"
                    >
                      {userData.name[0].toUpperCase()}
                    </div>
                  )
                ) : (
                  <Link to="/login">
                    <img
                      className="w-5 cursor-pointer"
                      src={assets.profile_icon}
                      alt="profile"
                    />
                  </Link>
                )}

                <div
                  className={`absolute dropdown-menu right-0 pt-4 ${
                    open ? "block" : "hidden"
                  } md:group-hover:block md:block}`}
                >
                  {loggedin && (
                    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded-2xl">
                      <p className="cursor-pointer hover:text-black">Profile</p>
                      <p
                        onClick={() => navigate("/orders")}
                        className="cursor-pointer hover:text-black"
                      >
                        Orders
                      </p>
                      <a
                        href="/"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout().then(() => {
                            navigate('/'); 
                          });
                        }}
                        className="cursor-pointer hover:text-black"
                      >
                        Logout
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <Link to="/cart" className="relative">
                <img
                  src={assets.cart_icon}
                  className="w-5 min-w-5"
                  alt="cart"
                />
                {getCartCount() > 0 && (
                  <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-primary text-white aspect-square rounded-full text-[8px]">
                    {getCartCount()}
                  </p>
                )}
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden ml-2">
              <button
                onClick={() =>
                  isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()
                }
                className="text-gray-800 focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mega menu: always mounted for smooth exit */}
        <MegaMenu
          category={openDropdown}
          open={!!openDropdown}
          onEnter={() => openDropdownNow(openDropdown)}
          onLeave={() => scheduleClose(500)}
        />

        {/* Mobile */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          close={closeMobileMenu}
          view={mobileView}
          setView={setMobileView}
          menuRef={menuRef}
        />
      </>
    )
  );
};

export default Navbar;
