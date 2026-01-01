import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { menuData, slugify } from "../components/menuData";
import toast from "react-hot-toast";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { backendUrl } from "../App";
import Ripple from "../components/RippleButton";

const AddProduct = ({ token }) => {
  const [material, setMaterial] = useState("marble");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image5, setImage5] = useState(false);
  const [image6, setImage6] = useState(false);
  const [name, setname] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [exclusive, setExculsive] = useState(false);
  const [premiumItem, setPremiumItem] = useState(false);
  const [bestseller, setBestSeller] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const headings = menuData[material]?.headings || [];

  // Dimensions / Size
  const [dimensionType, setDimensionType] = useState("lbh"); // "lbh" or "wh"
  const [unit, setUnit] = useState("inches"); // "inches" or "cm"
  const [margin1, setMargin1] = useState("");
  const [margin2, setMargin2] = useState("");
  const [margin3, setMargin3] = useState("");

  useEffect(() => {
    document.title = "Add Product | M Crystal Admin Panel";
  }, []);

  const categoryslug = slugify(category);
  const subCategoryslug = slugify(subCategory);

  const handleMaterialChange = (e) => {
    const selected = e.target.value;
    setMaterial(selected);
    setCategory("");
    setSubCategory("");
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    setSubCategory("");
  };

  const currentSubCategories = headings.find((h) => h.title === category)?.sub || [];

  const unitLabel = unit === "inches" ? "in" : "cm";

  const getSizePreview = () => {
    if (dimensionType === "lbh") {
      if (!margin1 || !margin2 || !margin3) return "—";
      return `${margin1}${unitLabel} x ${margin2}${unitLabel} x ${margin3}${unitLabel} (L x B x H)`;
    }
    if (dimensionType === "wh") {
      if (!margin1 || !margin2) return "—";
      return `${margin1}${unitLabel} x ${margin2}${unitLabel} (W x H)`;
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!image1) {
        toast.error("Please upload at least one image");
        return;
      }
      if (!name) {
        toast.error("Please enter product name");
        return;
      }
      if (!tagline) {
        toast.error("Please enter product tagline");
        return;
      }
      if (!description) {
        toast.error("Please enter product description");
        return;
      }
      if (!price) {
        toast.error("Please enter product price");
        return;
      }
      if (!sellPrice) {
        toast.error("Please enter selling price");
        return;
      }

      if (!category) {
        toast.error("Please select category");
        return;
      }

      if (!subCategory) {
        toast.error("Please select sub category");
        return;
      }
      if (!quantity) {
        toast.error("Please enter quantity");
        return;
      }
      if (dimensionType === "lbh" && (!margin1 || !margin2 || !margin3)) {
        toast.error("Please enter all dimensions (L × B × H)");
        return;
      }
      if (dimensionType === "wh" && (!margin1 || !margin2)) {
        toast.error("Please enter all dimensions (W × H)");
        return;
      }

      setLoading(true);
      const formData = new FormData();

      formData.append("name", name);
      formData.append("tagline", tagline);
      formData.append("description", description);
      formData.append("sellprice", sellPrice);
      formData.append("price", price);
      formData.append("material", material);
      formData.append("category", categoryslug);
      formData.append("subCategory", subCategoryslug);
      formData.append("quantity", quantity);
      formData.append("size", getSizePreview());
      formData.append("exculsiveItem", exclusive);
      formData.append("premiumItem", premiumItem);
      formData.append("bestseller", bestseller);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);
      image5 && formData.append("image5", image5);
      image6 && formData.append("image6", image6);

      const response = await axios.post(
        backendUrl + "/product/addproduct",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.msg);
        setLoading(false);
        setname("");
        setTagline("");
        setDescription("");
        setMaterial("marble");
        setCategory("");
        setSubCategory("");
        setPrice("");
        setSellPrice("");
        setQuantity("");
        setMargin1("");
        setMargin2("");
        setMargin3("");
        setDimensionType("lbh");
        setUnit("inches");
        setBestSeller(false);
        setExculsive(false);
        setPremiumItem(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setImage5(false);
        setImage6(false);
      } else {
        toast.error(response.data.msg);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="w-full max-w-4xl space-y-8">
      {/* Upload Images */}
      <div>
        <p className="text-lg font-medium mb-3">Upload Images</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {/* Image 1 */}
          <Ripple>
            <div className="relative w-full">
              <label htmlFor="image1" className="cursor-pointer">
                <img
                  className={`w-full aspect-square object-cover ${
                    image1 ? "" : "border-dashed border-2 border-gray-300"
                  } rounded-md hover:border-blue-500 transition`}
                  src={
                    !image1 ? assets.upload_area : URL.createObjectURL(image1)
                  }
                  alt="upload"
                />
              </label>

              {/* Cross Icon */}
              {image1 && (
                <img
                  onClick={() => setImage1(false)}
                  className="absolute z-30 top-1 right-1 w-6 h-6 bg-white hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              )}

              <input
                disabled={image1 ? true : false}
                onChange={(e) => setImage1(e.target.files[0])}
                type="file"
                accept="image/*"
                id="image1"
                hidden
              />
            </div>
          </Ripple>

          {/* Image 2 */}

          <Ripple>
            <div className="relative w-full">
              <label htmlFor="image2" className="cursor-pointer">
                <img
                  className={`w-full aspect-square object-cover ${
                    image2 ? "" : "border-dashed border-2 border-gray-300"
                  } rounded-md hover:border-blue-500 transition`}
                  src={
                    !image2 ? assets.upload_area : URL.createObjectURL(image2)
                  }
                  alt="upload"
                />
              </label>
              {image2 && (
                <img
                  onClick={() => setImage2(false)}
                  className="absolute z-30 top-1 right-1 w-6 h-6 bg-white hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              )}
              <input
                onChange={(e) => setImage2(e.target.files[0])}
                type="file"
                accept="image/*"
                id="image2"
                hidden
              />
            </div>
          </Ripple>

          {/* Image 3 */}

          <Ripple>
            <div className="relative w-full">
              <label htmlFor="image3" className="cursor-pointer">
                <img
                  className={`w-full aspect-square object-cover ${
                    image3 ? "" : "border-dashed border-2 border-gray-300"
                  } rounded-md hover:border-blue-500 transition`}
                  src={
                    !image3 ? assets.upload_area : URL.createObjectURL(image3)
                  }
                  alt="upload"
                />
              </label>
              {image3 && (
                <img
                  onClick={() => setImage3(false)}
                  className="absolute z-30 top-1 right-1 w-6 h-6 bg-white hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              )}
              <input
                onChange={(e) => setImage3(e.target.files[0])}
                type="file"
                accept="image/*"
                id="image3"
                hidden
              />
            </div>
          </Ripple>

          {/* Image 4 */}

          <Ripple>
            <div className="relative w-full">
              <label htmlFor="image4" className="cursor-pointer">
                <img
                  className={`w-full aspect-square object-cover ${
                    image4 ? "" : "border-dashed border-2 border-gray-300"
                  } rounded-md hover:border-blue-500 transition`}
                  src={
                    !image4 ? assets.upload_area : URL.createObjectURL(image4)
                  }
                  alt="upload"
                />
              </label>
              {image4 && (
                <img
                  onClick={() => setImage4(false)}
                  className="absolute z-30 top-1 right-1 w-6 h-6 bg-white hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              )}
              <input
                onChange={(e) => setImage4(e.target.files[0])}
                type="file"
                accept="image/*"
                id="image4"
                hidden
              />
            </div>
          </Ripple>

          {/* Image 5 */}

          <Ripple>
            <div className="relative w-full">
              <label htmlFor="image5" className="cursor-pointer">
                <img
                  className={`w-full aspect-square object-cover ${
                    image5 ? "" : "border-dashed border-2 border-gray-300"
                  } rounded-md hover:border-blue-500 transition`}
                  src={
                    !image5 ? assets.upload_area : URL.createObjectURL(image5)
                  }
                  alt="upload"
                />
              </label>
              {image5 && (
                <img
                  onClick={() => setImage5(false)}
                  className="absolute z-30 top-1 right-1 w-6 h-6 bg-white hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              )}
              <input
                onChange={(e) => setImage5(e.target.files[0])}
                type="file"
                accept="image/*"
                id="image5"
                hidden
              />
            </div>
          </Ripple>

          {/* Image 6 */}

          <Ripple>
            <div className="relative w-full">
              <label htmlFor="image6" className="cursor-pointer">
                <img
                  className={`w-full aspect-square object-cover ${
                    image6 ? "" : "border-dashed border-2 border-gray-300"
                  } rounded-md hover:border-blue-500 transition`}
                  src={
                    !image6 ? assets.upload_area : URL.createObjectURL(image6)
                  }
                  alt="upload"
                />
              </label>
              {image6 && (
                <img
                  onClick={() => setImage6(false)}
                  className="absolute z-30 top-1 right-1 w-6 h-6 bg-white hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  src={assets.cross_icon}
                  alt="cross_icon"
                />
              )}
              <input
                onChange={(e) => setImage6(e.target.files[0])}
                type="file"
                accept="image/*"
                id="image6"
                hidden
              />
            </div>
          </Ripple>
        </div>
      </div>

      {/* Product Name */}
      <div>
        <p className="mb-2 text-sm font-medium">Product Name</p>
        <input
          className="w-full px-3 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          type="text"
          placeholder="Type here"
          onChange={(e) => setname(e.target.value)}
          value={name}
        />
      </div>

      {/* Product Tagline */}
      <div>
        <p className="mb-2 text-sm font-medium">Product Tagline</p>
        <input
          className="w-full px-3 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          type="text"
          placeholder="Write product tagline here"
          onChange={(e) => setTagline(e.target.value)}
          value={tagline}
        />
      </div>

      {/* Product Description */}
      <div>
        <p className="mb-2 text-sm font-medium">Product Description</p>
        <textarea
          className="w-full px-3 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
          placeholder="Write product description here..."
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
      </div>

      {/* Material / Category / Sub Category */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <p className="mb-2 text-sm font-medium">Material</p>
          <select
            value={material}
            onChange={handleMaterialChange}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="marble">Marble</option>
            <option value="ceramic">Ceramic</option>
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Category</p>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Category</option>
            {headings.map((item, index) => (
              <option key={index} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={!category}
          >
            <option value="">Select Sub Category</option>
            {currentSubCategories.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price / Selling Price / Quantity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <p className="mb-2 text-sm font-medium">Product Price</p>
          <input
            type="number"
            placeholder="₹ 9999"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) =>
              (e.key === "ArrowUp" || e.key === "ArrowDown") &&
              e.preventDefault()
            }
            className="w-full px-3 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Selling Price</p>
          <input
            type="number"
            placeholder="₹ 8999"
            onChange={(e) => setSellPrice(e.target.value)}
            value={sellPrice}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) =>
              (e.key === "ArrowUp" || e.key === "ArrowDown") &&
              e.preventDefault()
            }
            className="w-full px-3 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Quantity</p>
          <input
            type="number"
            placeholder="Enter quantity"
            onChange={(e) => setQuantity(e.target.value)}
            value={quantity}
            onWheel={(e) => e.target.blur()}
            onKeyDown={(e) =>
              (e.key === "ArrowUp" || e.key === "ArrowDown") &&
              e.preventDefault()
            }
            className="w-full px-3 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <p className="mb-3 text-lg font-medium">Product Dimensions</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
          <select
            value={dimensionType}
            onChange={(e) => setDimensionType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="lbh">L × B × H</option>
            <option value="wh">W × H</option>
          </select>

          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="inches">Inches</option>
            <option value="cm">Centimeters</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <div>
            <p className="mb-2 font-medium">Margins:</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={margin1}
                onChange={(e) => setMargin1(e.target.value)}
                className="w-12 px-2 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={dimensionType === "lbh" ? "L" : "W"}
              />
              <p>×</p>
              <input
                type="number"
                value={margin2}
                onChange={(e) => setMargin2(e.target.value)}
                className="w-12 px-2 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={dimensionType === "lbh" ? "B" : "H"}
              />
              {dimensionType === "lbh" && (
                <>
                  <p>×</p>
                  <input
                    type="number"
                    value={margin3}
                    onChange={(e) => setMargin3(e.target.value)}
                    className="w-12 px-2 py-2 border rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="H"
                  />
                </>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Size:</p>
            <p className="text-gray-700 font-medium">{getSizePreview()}</p>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            onChange={() => setExculsive((prev) => !prev)}
            checked={exclusive}
            type="checkbox"
            id="exclusive"
            className="h-4 w-4"
          />
          <span className="text-sm">Exclusive</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            onChange={() => setPremiumItem((prev) => !prev)}
            checked={premiumItem}
            type="checkbox"
            id="premiumItem"
            className="h-4 w-4"
          />
          <span className="text-sm">Premium Item</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            onChange={() => setBestSeller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
            className="h-4 w-4"
          />
          <span className="text-sm">Best Seller</span>
        </label>
      </div>

      {/* Submit */}
      <Ripple className="w-full cursor-pointer">
        <button
          disabled={isLoading}
          type="submit"
          className="w-28 flex justify-center py-3 items-center mt-4 bg-black rounded-lg text-white"
        >
          {isLoading ? (
            <Oval
              height={26}
              width={28}
              color="#ffffff"
              secondaryColor="#c2c2c2"
              visible={true}
            />
          ) : (
            "ADD"
          )}
        </button>
      </Ripple>
    </form>
  );
};

export default AddProduct;
