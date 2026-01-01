import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { loggedin, authLoading } = useContext(ShopContext);

  if (authLoading) return null; // or loader

  if (!loggedin) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
