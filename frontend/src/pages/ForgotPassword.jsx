import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { backendUrl, ShopContext } from "../context/ShopContext";
import ResponsiveFabPortal from "../components/ResponsiveFabPortal";
import toast from "react-hot-toast";
import validator from "validator";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";

const ForgotPassword = () => {
  axios.defaults.withCredentials = true;
  const { bannerState, navigate } = useContext(ShopContext);

  /* ----------------------- States ----------------------- */
  const [sectionOneVisible, setsectionOneVisible] = useState(true);
  const [sectionTwoVisible, setsectionTwoVisible] = useState(false);
  const [sectionThreeVisible, setsectionThreeVisible] = useState(false);

  /* ---------------error paragraghs states ----------------- */
  const [exist, setExist] = useState("");

  const [email, setEmail] = useState("");

  const [newPassword, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isMinEight, setisMinEight] = useState("");
  const [isSpecialChar, setisSpecialChar] = useState(false);
  const [isUpperlower, setisUpperlower] = useState(false);
  const [isAlphaNum, setisAlphaNum] = useState(false);

  const inputRefs = useRef([]);

  /* OTP Timer */
  const [timer, setTimer] = useState(60);
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // 10 minutes
  const [hasResent, setHasResent] = useState(true); // allow only once

  useEffect(() => {
    document.title = "Create Account | M Crystal";
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [sectionThreeVisible]);

  /* Password Validation Effects */
  useEffect(() => {
    setisMinEight(newPassword.length >= 8 && newPassword.length <= 15);
    setisSpecialChar(
      /[@&:|.\^~#_\$!\)?]/.test(newPassword) &&
        /^[A-Za-z0-9@&:|.\^~#_\$!\)?]+$/.test(newPassword)
    );
    setisUpperlower(/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword));
    setisAlphaNum(/^(?=.*[A-Za-z])(?=.*\d).+$/.test(newPassword));
  }, [newPassword]);

  //restrict back button browers
  useEffect(() => {
    // block back ONLY for section 2 & 3
    if (!sectionTwoVisible && !sectionThreeVisible) return;

    const blockBack = () => {
      toast.error("Please complete the reset process");
      setsectionTwoVisible(false);
      setsectionThreeVisible(false);
      setsectionOneVisible(true);
    };

    // push fake history entry
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, [sectionTwoVisible, sectionThreeVisible, navigate]);

  //Prevent page refresh
  useEffect(() => {
    if (!sectionTwoVisible && !sectionThreeVisible) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // required for browser dialog
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sectionTwoVisible, sectionThreeVisible]);

  useEffect(() => {
    // user refreshed or accessed directly
    if (!email && (sectionTwoVisible || sectionThreeVisible)) {
      toast.error("Session expired. Please start again.");
      setsectionTwoVisible(false);
      setsectionThreeVisible(false);
      setsectionOneVisible(true);
    }
  }, [email, sectionTwoVisible, sectionThreeVisible]);

  const passwordValid =
    isMinEight && isSpecialChar && isUpperlower && isAlphaNum;

  /* Handle Proceed (Section 1 → Section 2) */
  const handleProceed = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email) {
      toast.error("Please enter the Email address");
      setLoading(false);
      return;
    }
    if (!validator.isEmail(email)) {
      toast.error("Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + "/user/usercheck", {
        email,
      });
      if (response.data.success) {
        setLoading(false);
        setExist("User doesn't exist. Create an account");
      } else {
        try {
          const response = await axios.post(
            backendUrl + "/user/send-reset-otp",
            { email }
          );
          if (response.data.success) {
            toast.success(response.data.msg);
            setLoading(false);
            setsectionTwoVisible(true);
            setsectionOneVisible(false);
          } else {
            toast.error(response.data.msg);
          }
        } catch (error) {
          setLoading(false);
          console.log(error.message);
          toast.error(error.message);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      toast.error(error.message);
    }
  };

  /* Handle Reset Password */
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword) return toast.error("Please enter a password");
    if (!confirm) return toast.error("Please confirm your password");
    if (!passwordValid)
      return toast.error("Some password requirements are missing");
    if (newPassword !== confirm) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      const response = await axios.post(backendUrl + "/user/reset-password", {
        email,
        newPassword,
      });
      if (response.data.success) {
        setLoading(false);
        toast.success(response.data.msg);
        navigate("/");
        setsectionThreeVisible(false);
      } else {
        setLoading(false);
        toast.error(response.data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      toast.error(error.message);
    }
  };

  /* ---------------- OTP Logic (Numbers Only) ------------------ */

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const handleInput = (e, index) => {
    const value = e.target.value.replace(/\D/g, ""); // only numbers
    e.target.value = value;

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);
  };

  /* OTP Timer Effect */
  useEffect(() => {
    if (!sectionTwoVisible) return;

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, sectionTwoVisible]);

  useEffect(() => {
    if (!sectionTwoVisible) return;

    const timer = setInterval(() => {
      setOtpTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timer, sectionTwoVisible]);

  useEffect(() => {
    if (!sectionTwoVisible) return;

    let timer;

    if (otpTimeLeft > 0) {
      timer = setInterval(() => {
        setOtpTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [sectionTwoVisible, otpTimeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    if (!hasResent) return; // block second resend

    try {
      const response = await axios.post(backendUrl + "/user/send-reset-otp", {
        email,
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        setLoading(false);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      toast.error(error.message);
    }

    setHasResent(false); // user used resend once
    setOtpTimeLeft(300); // restart timer
  };

  /* Handle Verify OTP (Section 2 → Section 3) */
  const verifyOTPHandler = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");
      if (otp.length < 6) {
        toast.error("Enter 6 digit OTP");
      }
      const { data } = await axios.post(backendUrl + "/user/verify-reset-otp", {
        email,
        otp,
      });
      if (data.success) {
        setLoading(false);
        toast.success(data.msg);
        setsectionTwoVisible(false);
        setsectionThreeVisible(true);
      } else {
        setLoading(false);
        toast.error(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className=" relative bg-white">
      {/* Background images */}
      {/* Mobile / small screens */}
      <div
        className="absolute inset-0 block lg:hidden bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bannerState.sm})` }}
      />
      {/* Large screens */}
      <div
        className="absolute inset-0 hidden lg:block bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bannerState.lg})` }}
      />

      {/* Page content */}

      <div className="relative z-10 min-h-screen flex">
        {/* Wrapper: bottom on small, right on large */}
        <div className="flex flex-col justify-end lg:justify-end lg:mr-16 lg:flex-row items-center lg:items-center w-full">
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
            <div className="flex flex-col items-center mt-8 mb-3">
              <img src={assets.logo} alt="M Crystal" className="h-10 w-auto" />
            </div>
            {/* ---------------------- SECTION ONE ----------------------- */}
            {sectionOneVisible && (
              <div className="mt-3">
                <p className="text-2xl font-semibold text-center text-gray-900">
                  Reset your password
                </p>
                <p className="text-xs text-center text-gray-500 my-3">
                  Confirm your email address to continue.
                </p>

                <form className="flex flex-col gap-3 my-10">
                  <label className="text-xs text-gray-600">Email</label>
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                      exist
                        ? "border-red-700 focus:ring-red-700"
                        : "border-gray-200 focus:ring-primary"
                    }`}
                  />
                  {exist && (
                    <p className="text-sm font-semibold text-red-700 ml-2">
                      {exist}
                    </p>
                  )}

                  <button
                    className="my-5 w-full flex flex-row items-center justify-center cursor-pointer py-2 px-4 rounded-md text-white bg-primary"
                    onClick={handleProceed}
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
                      "PROCEED"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ---------------------- SECTION TWO ----------------------- */}
            {sectionTwoVisible && (
              <div>
                <p className="text-2xl text-center font-medium my-5 text-primary">
                  Verify Email OTP
                </p>
                <p className="text-xs text-center text-gray-500">
                  Enter the 6-digit code sent to
                  <span className="font-semibold"> {email}</span>
                </p>

                {/* OTP Inputs */}
                <form
                  onSubmit={verifyOTPHandler}
                  className="flex flex-col gap-3 mt-4"
                >
                  <div
                    className="flex justify-between my-8"
                    onPaste={handlePaste}
                  >
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength="1"
                          ref={(el) => (inputRefs.current[index] = el)}
                          onInput={(e) => handleInput(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onClick={() => handleClick(index)}
                          className="w-12 h-12 border text-center border-gray-300 rounded-md text-primary 
                            text-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ))}
                  </div>

                  {/* OTP Timer */}
                  <p className="text-xs text-center text-gray-500 mt-2">
                    OTP expires in{" "}
                    <span className="font-semibold text-primary">
                      {formatTime(otpTimeLeft)}
                    </span>
                  </p>

                  <button className="mt-2 w-full flex flex-row items-center justify-center cursor-pointer py-2 px-4 rounded-md text-white bg-primary">
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
                      "VERIFY"
                    )}
                  </button>

                  {/* Resend Link */}
                  {hasResent && (
                    <p className="text-xs text-center text-gray-500 mt-3">
                      Didn’t receive the code?
                      <span className="text-primary ml-2 font-semibold">
                        {timer}s
                      </span>
                    </p>
                  )}

                  {hasResent && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timer > 0}
                      className={`ml-1 font-medium ${
                        timer > 0
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-primary"
                      }`}
                    >
                      Resend
                    </button>
                  )}
                </form>
              </div>
            )}

            {/* ---------------------- SECTION THREE ----------------------- */}
            {sectionThreeVisible && (
              <div>
                <p className="text-md lg:text-2xl text-center font-medium my-4 text-primary">
                  Create your password
                </p>

                <form className="flex flex-col gap-3 mt-2">
                  {/* Password */}
                  <label className="text-xs font-medium text-gray-700">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className={`w-full px-4 py-3 border rounded-lg shadow-sm outline-none transition 
                          ${
                            newPassword
                              ? passwordValid
                                ? "border-green-500 ring-2 ring-green-400"
                                : "border-red-500 ring-2 ring-red-400"
                              : "border-gray-200 focus:ring-2 focus:ring-primary"
                          }
                        `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
                    >
                      <img
                        src={showPwd ? assets.hide_eye : assets.show_eye}
                        className="w-5"
                      />
                    </button>
                  </div>

                  {/* Password rules */}
                  <div className="ml-2">
                    <p
                      className={`text-sm grid grid-cols-[0.1fr_2fr] gap-2 justify-start items-center ${
                        newPassword
                          ? isMinEight
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Use between 8-15 characters.
                    </p>
                    <p
                      className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
                        newPassword
                          ? isSpecialChar
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Use only these special characters: @ & : | . ^ ~ # _ $ ! )
                      ?
                    </p>
                    <p
                      className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
                        newPassword
                          ? isUpperlower
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      One Uppercase and one Lowercase letters.
                    </p>
                    <p
                      className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
                        newPassword
                          ? isAlphaNum
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Include a mix of alphabets and numbers.
                    </p>
                  </div>

                  {/* Confirm password */}
                  <label className="text-xs font-medium text-gray-700">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full px-4 py-3 border rounded-lg shadow-sm outline-none transition 
                        ${
                          confirm
                            ? newPassword === confirm
                              ? "border-green-500 ring-2 ring-green-400"
                              : "border-red-500 ring-2 ring-red-400"
                            : "border-gray-200 focus:ring-2 focus:ring-primary"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
                    >
                      <img
                        src={showConfirm ? assets.hide_eye : assets.show_eye}
                        className="w-5"
                      />
                    </button>
                  </div>

                  {/* Match indicator */}
                  {newPassword && confirm && (
                    <p
                      className={`ml-2 text-sm mt-1 ${
                        newPassword !== confirm
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Passwords{" "}
                      {newPassword !== confirm ? "do not match" : "match"}
                    </p>
                  )}

                  <button
                    onClick={handleResetPassword}
                    className="w-full flex justify-center items-center bg-primary text-white py-2 mt-1 rounded-lg text-sm shadow-sm hover:opacity-95"
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
                      "RESET PASSWORD"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      <ResponsiveFabPortal />
    </div>
  );
};

export default ForgotPassword;
