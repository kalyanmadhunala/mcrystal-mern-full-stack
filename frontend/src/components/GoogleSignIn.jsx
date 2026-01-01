// components/GoogleSignIn.jsx
import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { redirect, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const GoogleSignIn = ({ text = "Sign in with Google" }) => {

  const { getUserData, setCartData,getUserCart } = useContext(ShopContext)
  const btnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent multiple initializations
    if (window.google?.accounts) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => console.error("Failed to load Google Identity Services script");
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initializeGoogle = () => {
    if (!btnRef.current || !window.google?.accounts) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(btnRef.current, {
      theme: "outline",
      size: "large",
      shape: "square",
      logo_alignment: "left",
      ux_mode: "redirect",
      text: text, // uses prop
      width: btnRef.current.offsetWidth || 300,
    });

    // Optional: show One Tap prompt (uncomment if you want it)
    //window.google.accounts.id.prompt();
  };

  const handleCredentialResponse = async (response) => {
    try {
      const idToken = response.credential;
      if (!idToken){
        toast.error("No credential received")
      }

      // FIXED: This was completely broken before
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/account/auth`,
        { idToken }, // ← Correct: payload goes here
        {
          withCredentials: true,                    // ← Sends cookies (important for sessions)
          headers: { "Content-Type": "application/json" },
        }
      );

      // Now data is already parsed JSON
      if (data.action === "login") {
        navigate("/", { replace: true });
        await getUserData()
        await setCartData()
        await getUserCart()
      } else if (data.action === "set_password") {
        navigate(`/set-password?token=${encodeURIComponent(data.token)}`);
      } else {
        alert("Unknown action from server");
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      const msg = err.response?.data?.msg || err.message || "Sign in failed";
      alert(msg);
    }
  };

  return <div ref={btnRef} style={{ display: "inline-block" }} />;
};

export default GoogleSignIn;