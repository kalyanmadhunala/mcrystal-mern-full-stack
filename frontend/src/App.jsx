import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Marbleware from "./pages/Marbleware";
import Ceramicware from "./pages/Ceramicware";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer";
import PremiumCollections from "./pages/PremiumCollections";
import SearchBar from "./components/SearchBar";
import ScrollToTop from "./components/ScrollToTop";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Collections from "./pages/Collections";
import SetPassword from "./pages/SetPassword";
import { ShopContext } from "./context/ShopContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Verify from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";



const App = () => {
  const { loggedin } = useContext(ShopContext);

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marbleware/:subcategory?" element={<Marbleware />} />
        <Route path="/ceramicware/:subcategory?" element={<Ceramicware />} />
        <Route path="/premium-collections" element={<PremiumCollections />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:productId" element={<Product />} />
        <Route
          path="/login"
          element={loggedin ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={loggedin ? <Navigate to="/" replace /> : <SignUp />}
        />
        <Route
          path="/forgot-password"
          element={loggedin ? <Navigate to="/" replace /> : <ForgotPassword />}
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/set-password" element={<SetPassword />} />
        <Route
          path="/verify"
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
        <Route path="/not-found" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
