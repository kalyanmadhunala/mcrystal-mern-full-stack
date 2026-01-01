import { createContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { data, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo } from "react";

export const ShopContext = createContext();

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const getTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 16) {
    // morning
    return { lg: assets.bg_morning_lg, sm: assets.bg_morning_sm };
  } else if (hour >= 16 && hour < 20) {
    // evening
    return { lg: assets.bg_evening_lg, sm: assets.bg_evening_sm };
  } else {
    // night
    return { lg: assets.bg_night_lg, sm: assets.bg_night_sm };
  }
};

const ShopContextProvider = (props) => {
  axios.defaults.withCredentials = true;

  const currency = "₹ ";
  const delivery_fee = 100;

  const local = localStorage.getItem("cart");
  const navigate = useNavigate();

  const [loggedin, setLogin] = useState(false);
  const [userData, setUserData] = useState(false);
  const [cartSynced, setCartSynced] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [token, setToken] = useState("");

  const [hour, setHour] = useState(new Date().getHours());
  const [bannerState, setBannerState] = useState(() => getTimeOfDay());
  const [cartItems, setCartItems] = useState(() => {
    try {
      return local ? JSON.parse(local) : {};
    } catch {
      return {};
    }
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("lastPath", location.pathname);
  }, [location]);

  const lastPath = localStorage.getItem("lastPath") || "/";

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(backendUrl + "/product/productslist");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };


  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/user/userdata");
      if (data.success) {
        setLogin(true);
        setUserData(data.userData);
      } else {
        setLogin(false);
        setUserData(null);
      }
    } catch (error) {
      setLogin(false);
      setUserData(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setBannerState(getTimeOfDay());
  }, [hour]);

  const addToCart = async (itemId) => {
    if (loggedin) {
      try {
        const { data } = await axios.post(backendUrl + "/cart/addtocart", {
          itemId,
        });
        if (data.success) {
          setCartItems(data.cartData);
          toast.success(data.msg);
        } else {
          toast.error(data.msg);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    } else {
      let cartData = structuredClone(cartItems);
      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }

      setCartItems(cartData);
      toast.success("Product is added to cart");
    }

    //localStorage.removeItem("cart")
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      try {
        if (cartItems[items] > 0) {
          totalCount += cartItems[items];
        }
      } catch (error) {}
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, quantity) => {
    const itemInfo = products.find((product) => product._id === itemId);
    if (!itemInfo) return;

    // 🔥 FINAL quantity (single source of truth)
    let finalQty = quantity;

    if (quantity > itemInfo.quantity) {
      finalQty = itemInfo.quantity;

      setTimeout(() => {
        toast(<div>We will restock soon — stay tuned!</div>, {
          icon: (
            <img src={assets.tears_smile_emoji} alt="info" className="w-6" />
          ),
          position: "bottom-center",
        });
      }, 3000);
    }

    if (finalQty <= 0) finalQty = 0;

    setCartItems((prev) => {
      const updated = { ...prev };

      if (finalQty === 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = finalQty;
      }

      return updated;
    });

    if (loggedin) {
      if (finalQty > itemInfo.quantity) return;

      try {
        const { data } = await axios.post(backendUrl + "/cart/updatecart", {
          itemId,
          quantity: finalQty,
        });

        if (!data.success) {
          toast.error(data.msg);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getUserCart = async () => {
    try {
      const response = await axios.post(backendUrl + "/cart/getcartdata");
      if (response.data.success) {
        setCartItems(response.data.cartData);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getCartAmount = () => {
    if (!products.length) return 0;
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      try {
        if (cartItems[items] > 0) {
          totalAmount += itemInfo.price * cartItems[items];
        }
      } catch (error) {
        console.log(error);
      }
    }
    return totalAmount;
  };

  const getCartSellAmount = () => {
    if (!products.length) return 0;
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      try {
        if (cartItems[items] > 0) {
          totalAmount += itemInfo.sellprice * cartItems[items];
        }
      } catch (error) {
        console.log(error);
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    if (!loggedin) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (loggedin) {
      getUserCart();
    }
  }, [loggedin]);

  const setCartData = async () => {
    if (cartSynced) return;
    const cartData = JSON.parse(localStorage.getItem("cart")) || {};
    if (Object.keys(cartData).length === 0) return;
    try {
      const { data } = await axios.post(backendUrl + "/cart/setcartdata", {
        cartData,
      });
      if (!data.success) {
        toast.error(data.msg);
      }
      localStorage.removeItem("cart");
      setCartItems({});
    } catch (error) {
      console.log(error);
    }
  };


  const marbleProducts = useMemo(
    () => products.filter((p) => p.material === "marble"),
    [products]
  );
  const ceramicProducts = useMemo(
    () => products.filter((p) => p.material === "ceramic"),
    [products]
  );

  const premiumCollection = products.filter(
    (item) => item.premiumItem || (item.premiumItem && item.bestseller)
  );

  const value = {
    marbleProducts,
    ceramicProducts,
    premiumCollection,
    bannerState,
    navigate,
    search,
    setSearch,
    setCartItems,
    showSearch,
    setShowSearch,
    products,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    getCartSellAmount,
    loggedin,
    setLogin,
    lastPath,
    userData,
    setUserData,
    getUserData,
    setCartData,
    getUserCart,
    authLoading
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};
export default ShopContextProvider;
