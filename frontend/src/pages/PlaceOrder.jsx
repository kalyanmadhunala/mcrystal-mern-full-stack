import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { backendUrl, ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

const PlaceOrder = () => {
  const {
    navigate,
    loggedin,
    cartItems,
    setCartItems,
    getCartSellAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [addloading, setAddLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [initialValue, setinitialValue] = useState(0);

  axios.defaults.withCredentials = true;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(backendUrl + "/user/getaddresses");
        if (data.success) {
          setAddresses(data.addresses);

          const defaultIndex = data.addresses.findIndex(
            (addr) => addr.isDefault === true
          );

          if (defaultIndex !== -1) {
            setSelectedAddressIndex(defaultIndex);

            // 👇 ensure default address is visible
            if (defaultIndex >= 3) {
              setVisibleCount(Math.ceil((defaultIndex + 1) / 3) * 3);
            }
          }
        }
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    };

    fetchAddresses();
  }, []);

  const onAddAddress = async () => {
    try {
      setAddLoading(true);

      if (
        !formData.firstName &&
        !formData.street &&
        !formData.city &&
        !formData.state &&
        !formData.pincode &&
        !formData.phone
      ) {
        toast.error("Enter address details");
        setAddLoading(false);
        return;
      }

      if (!formData.firstName) {
        setAddLoading(false);
        return toast.error("Enter first name");
      }
      if (!formData.lastName) {
        setAddLoading(false);
        return toast.error("Enter last name");
      }
      if (!formData.email) {
        setAddLoading(false);
        return toast.error("Enter the Email");
      }
      if (!formData.street) {
        setAddLoading(false);
        return toast.error("Enter street");
      }
      if (!formData.city) {
        setAddLoading(false);
        return toast.error("Enter city");
      }
      if (!formData.state) {
        setAddLoading(false);
        return toast.error("Enter state");
      }
      if (!formData.pincode) {
        setAddLoading(false);
        return toast.error("Enter pincode");
      }
      if (!formData.country) {
        setAddLoading(false);
        return toast.error("Enter country");
      }
      if (!formData.phone) {
        setAddLoading(false);
        return toast.error("Enter Phone Number");
      }

      const normalizedPhone = formData.phone.startsWith("91")
        ? `+${formData.phone}`
        : `+91${formData.phone}`;

      const payload = {
        ...formData,
        phone: normalizedPhone,
      };

      const { data } = await axios.post(
        backendUrl + "/user/createaddress",
        payload,
        { withCredentials: true }
      );

      if (data.success) {
        setAddLoading(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          phone: "",
          isDefault: false,
        });
        setAddresses(data.addresses); // update address list
        setShowAddressForm(false); // hide form
        setSelectedAddressIndex(
          data.addresses.length - 1 // select newly added address
        );
        toast.success(data.msg);
      } else {
        toast.error(data.msg);
      }
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "M Crystal Store",
      description: "Order Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          setLoading(true);
          const { data } = await axios.post(
            backendUrl + "/order/verifyrazorpaypayment",
            response
          );
          if (data.success) {
            setLoading(false);
            setCartItems({});
            navigate("/orders");
            toast.success(data.msg);
          } else {
            setLoading(false);
            navigate("/cart");
            toast.error(data.msg);
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
          toast.error(error.message);
        }
      },
      modal: {
        ondismiss: async () => {
          await axios.post(backendUrl + "/order/verifyrazorpaypayment", {
            razorpay_order_id: order.id,
          });
          setLoading(false);
          toast.error("Payment cancelled");
          navigate("/cart");
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let orderItems = [];

      for (const items in cartItems) {
        if (cartItems[items] > 0) {
          const itemInfo = structuredClone(
            products.find((product) => product._id === items)
          );
          if (itemInfo) {
            itemInfo.quantity = cartItems[items];
            orderItems.push(itemInfo);
          }
        }
      }

      let selectedAddress = null;

      if (addresses.length > 0) {
        if (selectedAddressIndex === null) {
          toast.error("Please select an address");
          setLoading(false);
          return;
        }
        selectedAddress = addresses[selectedAddressIndex];
      } else {
        selectedAddress = formData;
      }

      let orderData = {
        address: selectedAddress,
        items: orderItems,
        amount: getCartSellAmount() + delivery_fee,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            backendUrl + "/order/placeordercod",
            orderData
          );
          if (response.data.success) {
            setLoading(false);
            setCartItems({});
            toast.success(response.data.msg);
            navigate("/orders");
          } else {
            setLoading(false);
            console.log(response.data.msg);
            toast.error(response.data.msg);
          }
          break;
        case "stripe":
          const responseStripe = await axios.post(
            backendUrl + "/order/placeorderstripe",
            orderData
          );
          if (responseStripe.data.success) {
            setLoading(false);
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            setLoading(false);
            toast.error(responseStripe.data.msg);
          }

          break;
        case "razorpay":
          const responseRazorpay = await axios.post(
            backendUrl + "/order/placeorderrazorpay",
            orderData
          );
          if (responseRazorpay.data.success) {
            setLoading(false);
            initPay(responseRazorpay.data.order);
          } else {
            toast.error(responseStripe.data.msg);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw] mt-16">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-200"
      >
        {/* ---------------------------Left Side ------------------------ */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="flex justify-between items-center">
            <div className="text-xl sm:text-2xl my-3">
              <Title text1={"DELIVERY"} text2={"INFORMATION"} />
            </div>
          </div>

          {/* ===== IF ADDRESSES EXIST ===== */}
          {addresses.length > 0 && !showAddressForm ? (
            <>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 text-sm mt-4 w-fit text-center">
                  SAVED ADDRESS{addresses.length > 1 ? <span>ES</span> : ""} (
                  {addresses.length})
                </p>
                {addresses.length > visibleCount && (
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleCount((prev) => prev + 3),
                        setinitialValue((prev) => prev + 3);
                    }}
                    className="text-gray-500 px-4 py-2 text-sm mt-4 w-fit justify-self-end text-center cursor-pointer hover:bg-gray-100 border-2 border-gray-500"
                  >
                    VIEW MORE ({addresses.length - visibleCount})
                  </button>
                )}
              </div>

              {addresses
                .slice(initialValue, visibleCount)
                .map((addr, index) => (
                  <div
                    key={addr._id || index}
                    onClick={() => setSelectedAddressIndex(index)}
                    className={`relative border rounded p-4 cursor-pointer transition-all ${
                      selectedAddressIndex === index
                        ? "border-primary bg-primary/10"
                        : "border-gray-300"
                    }`}
                  >
                    {/* DEFAULT BADGE */}
                    {addr.isDefault && (
                      <span className="absolute top-2 right-2 text-xs font-medium bg-primary text-white px-2 py-0.5 rounded">
                        DEFAULT ADDRESS
                      </span>
                    )}

                    <p className="font-medium">
                      {addr.firstName} {addr.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{addr.street},</p>
                    <p className="text-sm text-gray-600">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-sm">
                      {addr.phone.replace("+91", "+91 ")}, {addr.email}
                    </p>
                  </div>
                ))}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(true);
                  }}
                  className="bg-primary text-white px-4 py-2 text-sm mt-4 w-fit cursor-pointer"
                >
                  ADD ADDRESS
                </button>

                {(addresses.length > visibleCount ||
                  addresses.length < visibleCount) &&
                  initialValue !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setVisibleCount((prev) => prev - 3),
                          setinitialValue((prev) => prev - 3);
                      }}
                      className="text-gray-500 px-4 py-2 text-sm mt-4 w-fit text-center cursor-pointer hover:bg-gray-100 border-2 border-gray-500"
                    >
                      BACK
                    </button>
                  )}
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.firstName}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.lastName}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                />
              </div>
              <input
                required
                onChange={onChangeHandler}
                value={formData.email}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="email"
                name="email"
                placeholder="Email Address"
              />
              <input
                required
                onChange={onChangeHandler}
                value={formData.street}
                className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                type="text"
                name="street"
                placeholder="Flat, House No, Building Name, Apartment, Street"
              />
              <div className="flex gap-3">
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.city}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  name="city"
                  placeholder="City"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.state}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  name="state"
                  placeholder="State"
                />
              </div>
              <div className="flex gap-3">
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.pincode}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="number"
                  name="pincode"
                  placeholder="Pincode"
                />
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.country}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  name="country"
                  placeholder="Country"
                />
              </div>
              <div className="flex justify-center items-center gap-3">
                <p className="w-12 h-10 border border-gray-300 rounded flex items-center justify-center">
                  +91
                </p>
                <input
                  required
                  onChange={onChangeHandler}
                  value={formData.phone}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="number"
                  name="phone"
                  placeholder="Phone Number"
                />
              </div>

              <div className="flex gap-2 items-center justify-between">
                <button
                  type="button"
                  onClick={onAddAddress}
                  className="bg-primary text-white px-4 py-2 text-sm mt-4 w-fit cursor-pointer"
                >
                  {addloading ? (
                    <ThreeDots
                      visible={true}
                      height="24"
                      width="60"
                      color="#ffffff"
                      radius="2"
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    "SAVE ADDRESS"
                  )}
                </button>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false),
                        setFormData({
                          firstName: "",
                          lastName: "",
                          email: "",
                          street: "",
                          city: "",
                          state: "",
                          pincode: "",
                          country: "",
                          phone: "",
                          isDefault: false,
                        });
                    }}
                    className="text-gray-500 px-4 py-2 text-sm mt-4 w-fit text-center cursor-pointer hover:bg-gray-100 border-2 border-gray-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* -------------------- Right Side ----------------------------------- */}
        <div className="mt-4">
          <div
            onClick={() => navigate("/cart")}
            className="hidden lg:flex justify-end items-center"
          >
            <p className="hover:scale-120 transition-all duration-300 w-fit cursor-pointer text-end bg-transparent">
              Back
            </p>
          </div>

          <div className="mt-9 min-w-80">
            <CartTotal />
          </div>
          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("stripe")}
                className={`flex items-center justify-center border p-2 px-3 cursor-pointer ${
                  method === "stripe"
                    ? "border-2 border-primary bg-primary/10"
                    : ""
                }`}
              >
                <img
                  className="h-5 mx-4"
                  src={assets.stripe_logo}
                  alt="stripe"
                />
              </div>
              <div
                onClick={() => setMethod("razorpay")}
                className={`flex items-center justify-center border p-2 px-3 cursor-pointer ${
                  method === "razorpay"
                    ? "border-2 border-primary bg-primary/10"
                    : ""
                }`}
              >
                <img
                  className="h-5 mx-4"
                  src={assets.razorpay_logo}
                  alt="stripe"
                />
              </div>
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center justify-center border p-2 px-3 cursor-pointer ${
                  method === "cod"
                    ? "border-2 border-primary bg-primary/10"
                    : ""
                }`}
              >
                <p className="text-gray-700 text-sm font-medium mx-4">
                  CASH ON DELIVERY
                </p>
              </div>
            </div>
            <div className="w-full text-end mt-6">
              <div className="flex items-center justify-between lg:justify-end">
                <div
                  onClick={() => navigate("/cart")}
                  className="flex lg:hidden justify-center items-center"
                >
                  <p className="hover:scale-120 transition-all duration-300 w-fit cursor-pointer bg-transparent ml-5">
                    Back
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white hover:text-secondary active:text-gray-400 px-16 py-3 text-sm cursor-pointer"
                >
                  {loading ? (
                    <ThreeDots
                      visible={true}
                      height="24"
                      width="70"
                      color="#ffffff"
                      radius="2"
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    "PLACE ORDER"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
