import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { backendUrl, ShopContext } from "../context/ShopContext";
import ResponsiveFabPortal from "../components/ResponsiveFabPortal";
import GoogleSignIn from "../components/GoogleSignIn";
import axios from "axios";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

const Login = () => {
  axios.defaults.withCredentials = true;
  const {
    bannerState,
    loggedin,
    setLogin,
    lastPath,
    navigate,
    getUserData,
    userData,
    setCartData,
    getUserCart,
  } = useContext(ShopContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | M Crystal";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + "/user/login", {
        email,
        password,
      });
      if (response.data.success) {
        setLoading(false);
        setLogin(true);
        await getUserData();
        await setCartData();
        await getUserCart();
        navigate(lastPath);
      } else {
        setLoading(false);
        toast.error(response.data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleForgot = () => {
    setLoading(true);
    try {
      setLoading(false);
      navigate("/forgot-password");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen relative bg-white">
      {/* Background images */}
      {/* Mobile / small screens */}
      <img
        src={bannerState.sm}
        alt="Login background mobile"
        className="absolute inset-0 block lg:hidden w-full h-full object-cover"
        width="1080"
        height="1920"
        loading="eager"
      />

      {/* Large screens */}
      <img
        src={bannerState.lg}
        alt="Login background desktop"
        className="absolute inset-0 hidden lg:block w-full h-full object-cover"
        width="1920"
        height="1080"
        loading="eager"
        fetchpriority="high"
      />

      {/* Page content */}

      <div className="relative z-10 min-h-screen flex">
        {/* Wrapper: bottom on small, right on large */}
        <div className="flex flex-col justify-end lg:justify-end lg:mr-16 lg:flex-row items-center lg:items-center w-full">
          {/* Login Card */}
          <div
            className="
              bg-white lg:rounded-3xl shadow-xl rounded-t-3xl
              w-full max-w-xl lg:w-[440px] lg:h-[580px]
              lg:mr-16
              py-3 px-6 sm:py-8 sm:px-12
               min-h-[65vh] flex flex-col
            "
          >
            {/* Logo */}
            <div className="flex flex-col items-center gap-2 mt-5 mb-2">
              <img src={assets.logo} alt="M Crystal" className="h-10 w-auto" />
              <p className="text-xs allura-regular text-primary">Login</p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-3 mt-2" onSubmit={handleSubmit}>
              <label className="text-xs text-gray-600">Email</label>
              <input
                value={email}
                type="email"
                required
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <label className="text-xs text-gray-600">Password</label>
              <div className="pw-wrap relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm 
                focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="
        pw-toggle absolute right-3 top-1/2 -translate-y-1/2
        cursor-pointer select-none
        rounded-full p-1
        transition-all duration-200 ease-out
        hover:bg-black/5
      "
                >
                  <img
                    src={showPassword ? assets.hide_eye : assets.show_eye}
                    alt="toggle password"
                    className="w-5 h-5 pointer-events-none"
                  />
                </button>
              </div>

              <button
                className="mt-2 w-full flex flex-row items-center justify-center cursor-pointer py-2 px-4 rounded-md text-white bg-primary"
                onClick={handleSubmit}
              >
                {loading ? (
                  <ThreeDots
                    visible={true}
                    height="24"
                    width="50"
                    color="#ffffff"
                    radius="9"
                    ariaLabel="three-dots-loading"
                  />
                ) : (
                  "Login"
                )}
              </button>

              <button
                type="button"
                onClick={handleForgot}
                className="text-sm text-primary hover:text-secondary mt-1 lg:mt-2 cursor-pointer"
              >
                I forgot my password
              </button>

              <div className="text-center text-sm text-gray-500 mt-1 lg:mt-2">
                <span>Don't have an account? </span>
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:text-secondary"
                >
                  Sign up
                </Link>
              </div>
            </form>
            <div className="flex items-center my-4 gap-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="flex items-center justify-center w-full">
              <GoogleSignIn text="Continue with Google" />
            </div>
          </div>
        </div>
      </div>
      <ResponsiveFabPortal />
    </div>
  );
};

export default Login;
