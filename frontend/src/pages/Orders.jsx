import React, { useContext, useEffect, useRef, useState } from "react";
import { backendUrl, ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import NoOrders from "../components/NoOrders";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";

const Orders = () => {
  const { currency, loggedin } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [orderStatus, setOrderStatus] = useState({});

  const dropdownRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".dropdown-root")) {
      setOpenDropdownId(null);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


  const fetchOrderData = async () => {
    try {
      if (!loggedin) return null;

      const response = await axios.post(backendUrl + "/order/userorders");
      if (response.data.success) {
        let allOrders = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            (item["_id"] = order._id),
              (item["status"] = order.status),
              (item["payment"] = order.payment),
              (item["paymentMethod"] = order.paymentMethod),
              (item["date"] = order.date);
            allOrders.push(item);
          });
        });
        setOrderData(allOrders.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [loggedin]);

  const fetchInvoice = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + "/order/orderinvoice", {
        orderId,
      });
      if (response.data.success) {
        window.open(response.data.invoice.invoice_url, "_blank");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchMobileInvoice = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + "/order/orderinvoice", {
        orderId,
      });

      if (!response.data.success) {
        return toast.error(response.data.msg);
      }

      const fileRes = await fetch(response.data.invoice.invoice_url);
      const blob = await fileRes.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${response.data.invoice.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchOrderStatus = async (orderId) => {
    try {
      const response = await axios.post(backendUrl + "/order/trackorder", {
        orderId,
      });
      if (response.data.success) {
        setOrderStatus((prev) => ({
          ...prev,
          [orderId]: response.data.status,
        }));
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const title = "Your Orders";
    document.title = title + " | M Crystal";
  }, []);

  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div className="border-t pt-16 border-gray-200">
        {orderData.length > 0 ? (
          <div>
            <div className="text-2xl">
              <Title text1={"MY"} text2={"ORDERS"} />
            </div>

            <div className="border-t border-gray-200">
              {orderData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex py-4 border-b border-gray-200 text-gray-700 flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="flex items-start gap-6 text-sm">
                      <img
                        className="w-16 sm:w-20 rounded-lg"
                        src={item.images[0]}
                        alt="product"
                      />
                      <div>
                        <p className="sm:text-base font-medium">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                          <p className="text-lg">
                            {currency}
                            {item.sellprice * item.quantity}
                          </p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <p className="mt-1">
                          Date:{" "}
                          <span className="text-gray-400">
                            {new Date(item.date).toDateString()}
                          </span>
                        </p>
                        <p className="mt-1">
                          Payment:{" "}
                          <span className="text-gray-400">
                            {item.paymentMethod}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-[2fr_2fr_1fr] md:grid-cols-[2fr_1fr_1fr] gap-4">
                      <div
                        className={`flex items-center ${
                          (orderStatus[item._id] || item.status) !== "Delivered"
                            ? "gap-3"
                            : "gap-1"
                        }`}
                      >
                        <div
                          className={`min-w-2 h-2 rounded-full flex items-center ${
                            (orderStatus[item._id] || item.status) !==
                            "Delivered"
                              ? "bg-green-500"
                              : ""
                          } `}
                        >
                          {(orderStatus[item._id] || item.status) !==
                          "Delivered" ? (
                            <p className="min-w-2 h-2 rounded-full bg-green-500 animate-status-pulse-soft"></p>
                          ) : (
                            <img
                              src={assets.check_icon}
                              alt="check"
                              className="w-5"
                            />
                          )}
                        </div>
                        <p className="text-sm md:text-base ml-1">
                          {orderStatus[item._id] || item.status}
                        </p>
                      </div>
                      <button
                        onClick={() => fetchOrderStatus(item._id)}
                        className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
                      >
                        Track order
                      </button>
                      <button
                        onClick={() => fetchInvoice(item._id)}
                        className="hidden lg:block border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer"
                      >
                        View Invoice
                      </button>

                      <div className="relative flex justify-center items-center">
                        <button
                          onClick={(e) => {
                            
                            setOpenDropdownId(
                              openDropdownId === item._id ? null : item._id
                            );
                          }}
                          className="block lg:hidden border px-2 py-2 text-sm font-medium rounded-full cursor-pointer"
                        >
                          <img
                            src={assets.more_icon}
                            alt="more"
                            className="w-4 h-4"
                          />
                        </button>

                        <div
                          className={`absolute top-6 right-0 z-50 pt-4 ${
                            openDropdownId === item._id ? "block" : "hidden"
                          } lg:hidden`}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <div className="flex gap-2 w-36 py-3 px-5 justify-center items-center bg-slate-100 text-gray-600 rounded-2xl shadow-lg">
                            <img
                              src={assets.download_icon}
                              alt=""
                              className="w-5"
                            />
                            <button
                              type="button"
                              onMouseDown={() => {
                                fetchMobileInvoice(item._id);
                                setOpenDropdownId(null);
                              }}
                              className="text-sm font-medium"
                            >
                              Invoice
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <NoOrders />
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
