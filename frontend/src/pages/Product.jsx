import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import ProductImageRibbon from "../components/ProductImageRibbon";
import toast from "react-hot-toast";
import ProductSkeleton from "../components/ProductSkeleton";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    document.title = productData.name + " | Mycrstal";
  }, [productData]);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.images[0]);
        return null;
      }
    });
  };

  const productUrl = window.location.href;

  const generateShortLink = async (longUrl) => {
    try {
      const res = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
      );
      return await res.text();
    } catch {
      return longUrl;
    }
  };

  /* WhatsApp */
  const handleWhatsAppShare = async () => {
    const shortUrl = await generateShortLink(productUrl);
    const text = `Check out this product:\n${productData.name}\n${shortUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    setShowShare(false);
  };

  /* Copy Link */
  const handleCopyLink = async () => {
    const shortUrl = await generateShortLink(productUrl);
    await navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied!");
    setShowShare(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: productData.tagline,
          url: productUrl,
        });
        setShowShare(false);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      setShowShare(true); // fallback to custom popup
    }
  };

  const offerPercent = (
    ((productData.price - productData.sellprice) / productData.price) *
    100
  ).toFixed();

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return <ProductSkeleton />;
  }

  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div className="border-t border-gray-200 pt-10 transition-opacity ease-in duration-500 opacity-100">
        {/* ----------------------- Product Data ---------------------------- */}
        <div className="flex gap-10 sm:gap-10 flex-col sm:flex-row">
          {/* --------------------- Product Images -------------------------- */}
          <div className="flex-1 flex flex-col-reverse gap-5 sm:flex-row">
            <div
              className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full"
              style={{ scrollbarWidth: "none" }}
            >
              {productData.images.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  src={item}
                  key={index}
                  alt=""
                />
              ))}
            </div>

            <div className="w-full sm:w-[80%] relative overflow-visible">
              {productData.quantity > 0 && productData.quantity <= 5 && (
                <ProductImageRibbon text={productData.quantity} />
              )}
              <img className="w-full h-auto" src={image} alt="" />
              <div
                onClick={handleNativeShare}
                className="absolute right-5 top-5 cursor-pointer bg-white rounded-full p-2 hover:bg-gray-200 z-20"
              >
                <img src={assets.share_icon} alt="share" className="w-5" />
              </div>

              {showShare && (
                <div
                  className="absolute right-5 top-16 bg-slate-200 rounded-2xl py-2 px-2
    flex flex-col gap-1 shadow-lg z-30
    animate-fadeSlide"
                >
                  <div
                    onClick={handleWhatsAppShare}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-xl"
                  >
                    <img src={assets.whatsapp_logo} className="w-5" />
                    <p className="text-sm">WhatsApp</p>
                  </div>

                  <hr className="my-1" />

                  <div
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-4 py-2 rounded-xl"
                  >
                    <img src={assets.link_icon} className="w-4 h-4" />
                    <p className="text-sm">Copy link</p>
                  </div>
                </div>
              )}

              {productData.quantity === 0 && (
                <div className="absolute inset-0 bg-primary/80 z-10 flex justify-center items-center">
                  <p className="text-center text-white font-medium text-2xl">
                    Out of Stock
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* --------------------------- Product Info --------------------------- */}
          <div className="flex-1">
            <h2 className="font-medium text-2xl mt-2">{productData.name}</h2>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-3 mt-3">
              <div className="flex gap-1 h-5">
                <img src={assets.star_full_icon} alt="" className="w-5" />
                <img src={assets.star_full_icon} alt="" className="w-5" />
                <img src={assets.star_full_icon} alt="" className="w-5" />
                <img src={assets.star_full_icon} alt="" className="w-5" />
                <img src={assets.star_line_icon} alt="" className="w-5" />
                <p className="pl-2">(122)</p>
              </div>

              <div className="flex gap-2 mt-2 lg:mt-0">
                {productData.exculsiveItem && (
                  <p className="text-white bg-red-600 p-1 px-2 rounded-lg shadow-md">
                    Exclusive
                  </p>
                )}
                {productData.premiumItem && (
                  <p className="text-white bg-secondary p-1 px-2 rounded-lg shadow-md">
                    Premium
                  </p>
                )}
                {productData.bestseller && (
                  <p className="text-white bg-primary p-1 px-2 rounded-lg shadow-md">
                    Best Seller
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-col justify-start gap-3">
                <div className="flex gap-2 justify-start items-center">
                  <p className="text-red-600 text-xl mt-5">-{offerPercent}%</p>
                  <p className="mt-5 text-3xl font-medium">
                    {currency}
                    {productData.sellprice}
                  </p>
                </div>
                <p className="text-md font-medium text-gray-400">
                  M.R.P{" "}
                  <span className="line-through">
                    {currency}
                    {productData.price}
                  </span>
                </p>
              </div>
              <p className="mt-3 text-gray-500 md:w-4/5">
                {productData.tagline}
              </p>
              <div className="flex flex-col gap-2 my-8">
                <p>Size:</p>
                <div>
                  <p className="border w-fit py-2 px-4 bg-gray-100">
                    {productData.size}
                  </p>
                </div>
              </div>
              {productData.quantity === 0 ? (
                <p className="text-red-600 font-semibold text-2xl">
                  Currently Unavailable...
                </p>
              ) : (
                <button
                  onClick={() => addToCart(productData._id)}
                  className="bg-primary text-white hover:text-secondary cursor-pointer px-8 py-3 text-sm active:bg-gray-700 mt-3"
                >
                  ADD TO CART
                </button>
              )}

              <hr className="mt-8 text-gray-200 sm:w-4/5" />
              <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <img className="w-4" src={assets.check_icon} alt="check" />
                  <p>100% Original product.</p>
                </div>
                <div className="flex items-center gap-2">
                  <img className="w-4" src={assets.check_icon} alt="check" />
                  <p>Cash on delivery is available on this product.</p>
                </div>
                <div className="flex items-center gap-2">
                  <img className="w-4" src={assets.check_icon} alt="check" />
                  <p>Easy return and exchange policy within 7 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ----------------- Description & Review Section ------------------ */}
        <div className="mt-20">
          <div className="flex ">
            <b className="border border-gray-200 px-5 py-3 text-sm">
              Description
            </b>
            <p className="border border-gray-200 px-5 py-3 text-sm">
              Reviews (122)
            </p>
            <p className="border border-gray-200 px-5 py-3 text-sm">
              Write a review
            </p>
          </div>
          <div className="flex flex-col gap-4 border border-gray-200 px-6 py-6 text-sm text-gray-500">
            <p>{productData.description}</p>
            <p>
              M Crystal Store brings elegance into everyday living with
              thoughtfully crafted marble and ceramic décor. Each piece blends
              timeless design with modern aesthetics, inspired by fine
              craftsmanship. From home décor to devotional collections, every
              product reflects quality and care. We focus on durability, beauty,
              and meaningful details in every creation. M Crystal Store helps
              you transform spaces into refined, graceful experiences.
            </p>
          </div>
        </div>

        {/* ----------------------- Display Related Products ------------------ */}

        <RelatedProducts
          id={productData._id}
          material={productData.material}
          category={productData.category}
          subcategory={productData.subcategory}
        />
      </div>
    </div>
  )
};

export default Product;
