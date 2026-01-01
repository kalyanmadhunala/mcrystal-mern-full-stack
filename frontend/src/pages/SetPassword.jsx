// pages/SetPassword.jsx
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { assets } from "../assets/assets";
import { useRef } from "react";
import { ShopContext } from "../context/ShopContext";

// const PasswordStrength = ({ value }) => {
//   if (!value) return null;

//   let score = 0;

//   // 1) Minimum length 8
//   if (value.length >= 8) score++;

//   // 2) Has BOTH uppercase + lowercase
//   if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;

//   // 3) Has one allowed special character (#, $, &, *, %)
//   if (/[#\$&\*%]/.test(value)) score++;

//   // 4) Bonus point — longer + more complex (optional)
//   if (
//     value.length >= 12 &&
//     /[A-Z]/.test(value) &&
//     /[a-z]/.test(value) &&
//     /[0-9]/.test(value)
//   ) {
//     score++;
//   }

//   const labels = ["Weak", "Medium", "Strong"];
//   const colors = ["bg-red-400", "bg-yellow-400", "bg-green-400"];
//   const idx = Math.min(Math.max(score - 1, 0), 2);

//   return (
//     <div className="mt-2">
//       <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
//         <div
//           className={`h-full ${colors[idx]} transition-all duration-300`}
//           style={{ width: `${(score / 3) * 100}%` }}
//         />
//       </div>
//       <div className="text-xs mt-1 text-gray-600">
//         {labels[Math.max(score - 1, 0)]}
//       </div>
//     </div>
//   );
// };

const SetPassword = () => {

  const {getUserData} = useContext(ShopContext)

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMinEight, setisMinEight] = useState("");
  const [isSpecialChar, setisSpecialChar] = useState(false);
  const [isUpperlower, setisUpperlower] = useState(false);
  const [isAlphaNum, setisAlphaNum] = useState(false);

  useEffect(() => {
    document.title = "Set Password | M Crystal";
  }, []);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token.");
    }
  }, [token]);


  useEffect(() => {
    //min char check(8-15)
    setisMinEight(password.length >= 8 && password.length <= 15);

    //special char check
    setisSpecialChar(
      /[@&:|.\^~#_\$!\)?]/.test(password) &&
        /^[A-Za-z0-9@&:|.\^~#_\$!\)?]+$/.test(password)
    );

    //upperlower alpha check
    setisUpperlower(/[A-Z]/.test(password) && /[a-z]/.test(password));

    //alphaNum combo check
    setisAlphaNum(/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password));
  }, [password]);

  const passwordValid =
    isMinEight && isSpecialChar && isUpperlower && isAlphaNum;

    // onSubmit - set password
  const onSubmit = async (e) => {
    e.preventDefault();

    //length
    if (!passwordValid) {
      toast.error("Password should met all checks");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or expired link.");
      return;
    }

    setLoading(true);
    try {
      const url = `${
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
      }/account/set-password`;
      const res = await axios.post(
        url,
        { token, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // success
      if (res.data.success) {
        toast.success(res.data.msg || "Password set. Redirecting...");
        getUserData()
        setTimeout(() => navigate("/"), 2000);
      } else {
        // failure
        toast.error(res.data.msg);
      }
    } catch (err) {
      console.error("SetPassword axios error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      const msg = err.response?.data?.msg;
      if (err.response?.status === 400) {
        // show exact backend message if present
        toast.error(msg || "Bad request. Check token or password.");
      } else {
        toast.error(msg || "Server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-primary to-primary
 flex items-center justify-center py-12 px-4"
    >
      <div className="w-full max-w-[495px] bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center">
          <img src={assets.mcrystal_logo} alt="logo" className="w-16 mb-3" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Set your password
          </h1>
          <p className="text-xs text-gray-500 text-center mt-2">
            Create a password for your M Crystal account. After setting it
            you'll be signed in.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6">
          <label className="block text-xs font-medium text-gray-700">
            New password
          </label>
          <div className="mt-1 relative">
            <input
              type={showPwd ? "text" : "password"}
              value={password}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" Enter password"
              className={`block w-full px-4 py-3 border rounded-lg shadow-sm outline-none
    transition 
    ${
      password
        ? passwordValid
          ? "border-green-500 ring-2 ring-green-400"
          : "border-red-500 ring-2 ring-red-400"
        : "border-gray-200 focus:ring-2 focus:ring-primary"
    }
  `}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer rounded-full hover:bg-gray-100"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              <img
                src={showPwd ? assets.hide_eye : assets.show_eye}
                alt="toggle password"
                className="w-5 h-5 pointer-events-none"
              />
            </button>
          </div>

          {/* <PasswordStrength value={password} /> */}

          {/* Password checks validators */}
          <div className="ml-2 ">
            <p
              className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
      password
        ? isMinEight
          ? "text-green-500 "
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
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
              Use between 8-15 characters.
            </p>
            <p
              className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
      password
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
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
              Use only these special characters: @ & : | . ^ ~ # _ $ ! ) ?
            </p>
            <p
              className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
      password
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
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
              One Uppercase and one Lowercase letters.
            </p>

            <p
              className={`text-sm grid grid-cols-[0.1fr_2fr] mt-2 gap-2 justify-start items-center ${
      password
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
                  fill-rule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clip-rule="evenodd"
                />
              </svg>
              Include a mix of alphabets and numbers.
            </p>
          </div>

          <label className="block text-xs font-medium text-gray-700 mt-4">
            Confirm password
          </label>
          <div className="mt-1 relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className={`block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
      confirm
        ? password === confirm
          ? "border-green-500 ring-2 ring-green-400"
          : "border-red-500 ring-2 ring-red-400"
        : "border-gray-200 focus:ring-2 focus:ring-primary"
    }`}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer rounded-full hover:bg-gray-100"
              aria-label={
                showConfirm ? "Hide confirm password" : "Show confirm password"
              }
            >
              <img
                src={showConfirm ? assets.hide_eye : assets.show_eye}
                alt="toggle password"
                className="w-5 h-5 pointer-events-none"
              />
            </button>
          </div>

          {password && confirm ? (
            <div className="ml-2">
              <p
                className={`text-sm grid grid-cols-[0.1fr_2fr] mt-1 gap-2 justify-start items-center ${
                  password !== confirm
                    ? "text-red-400"
                    : "text-green-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clip-rule="evenodd"
                  />
                </svg>
                Password is {password !== confirm ? "not Matched" : "Matched"}
              </p>
            </div>
          ) : (
            ""
          )}

          <div className="mt-3">
            <button
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white font-medium shadow-sm transition ${
                loading
                  ? "bg-primary/70 cursor-wait"
                  : "bg-primary hover:opacity-95"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Set password & Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary underline hover:text-secondary"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
