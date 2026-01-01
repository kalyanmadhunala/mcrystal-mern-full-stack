import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import toast from "react-hot-toast";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import Ripple from "./RippleButton";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false)

  const navigate = useNavigate()


  useEffect(() => {
    document.title = "Login | M Crystal Admin Panel";
  }, []);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!email && !password) {
        toast.error("Enter the login credentials");
        return;
      }
      if (!email) {
        toast.error("Enter Email Address");
        return;
      }
      if (!password) {
        toast.error("Enter password");
        return;
      }
      if (!validator.isEmail(email)) {
        toast.error("Please enter a valid email");
        return;
      }
      setLoading(true)

      const response = await axios.post(backendUrl + "/admin/login", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        setLoading(false)
        navigate("/add")        
      } else {
        toast.error(response.data.msg);
        setLoading(false)
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="text"
              placeholder="you@email.com"
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="Enter your password"
            />
          </div>
          <Ripple className="w-full cursor-pointer">
            <button
            className="mt-2 w-full flex flex-row items-center justify-center cursor-pointer py-2 px-4 rounded-md text-white bg-black"
            type="submit"
          >
            {isLoading ? (
            <ThreeDots  visible={true} height="24" width="50" color="#ffffff" radius="9" ariaLabel="three-dots-loading" />
          ) : (
            "Login"
          )}
          </button>
          </Ripple>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
