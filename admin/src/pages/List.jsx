import axios from "axios";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { backendUrl, currency } from "../App";
import toast from "react-hot-toast";
import { Oval } from "react-loader-spinner";
import Ripple from "../components/RippleButton";
import { menuData, slugify } from "../components/menuData";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [material, setMaterial] = useState("marble");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const headings = menuData[material]?.headings || [];

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/product/productslist");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

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

  const currentSubCategories =
    headings.find((h) => h.title === category)?.sub || [];

  const removeProduct = async (id) => {
    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/product/removeproduct",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.msg);
        setLoading(false);
        fetchList();
      } else {
        toast.error(response.data.msg);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Products list | M Crystal Admin Panel";
    fetchList();
  }, []);

  const categoryslug = slugify(category);
  const subCategoryslug = slugify(subCategory);

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      if (material && item.material !== material) return false;
      if (category && item.category !== categoryslug) return false;
      if (subCategory && item.subCategory !== subCategoryslug) return false;
      return true;
    });
  }, [list, material, category, subCategory]);

  const formatTitle = (slug) => {
    if (!slug) return "None";
    return slug
      .replace(/-and-/gi, " & ")
      .replace(/-or-/gi, " / ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <>
      <div className="flex justify-between items-center my-2">
        <p className="mb-2">All Products List</p>
        <p>
          {filteredList.length === 0
            ? ""
            : filteredList.length === 1
            ? `${filteredList.length} product`
            : `${filteredList.length} products`}
          {filteredList.length === 0 ? "Products Not" : ""} found
          {material && ` in ${material}ware`}
          {category && ` > ${category}`}
          {subCategory && ` > ${subCategory}`}
        </p>
      </div>
      <div className="flex flex-col gap-2">
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
        {/* ---------------------List Table Title --------------------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-200 items-center py-1 px-2 border border-gray-300 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Material</b>
          <b>Category</b>
          <b>Sub Category</b>
          <b>Quantity</b>
          <b>Sell Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------------------------ Product List ---------------------------- */}
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <Ripple key={index}>
              <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 gap-2 px-2 rounded-md border border-gray-200 text-sm">
                <img
                  className="rounded-md"
                  src={item.images[0]}
                  alt={item.name}
                />
                <div className="flex flex-col gap-3">
                <p>{formatTitle(item.name)}</p>
                <div className="flex gap-2">
                  {item.exculsiveItem && <span className="bg-red-700 text-white text-xs font-medium w-fit p-2 rounded-4xl">Exculsive</span>}
                  {item.premiumItem && <span className="bg-secondary text-white text-xs font-medium w-fit p-2 rounded-4xl">Premium</span>}
                  {item.bestseller && <span className="bg-primary text-white text-xs font-medium w-fit p-2 rounded-4xl">Best Seller</span>}
                </div>
                
                </div>
                
                <p>{formatTitle(item.material)}</p>
                <p>{formatTitle(item.category)}</p>
                <p>{formatTitle(item.subCategory)}</p>
                <div>
                  <p
                    className={`${
                      item.quantity <= 5
                        ? "text-red-600 bg-red-100 rounded-full font-medium text-center w-fit p-2"
                        : ""
                    }`}
                  >
                    {item.quantity}
                  </p>
                </div>
                <p>
                  {currency} {item.sellprice}
                </p>
                <p
                  onClick={() => removeProduct(item._id)}
                  className="flex items-center justify-center text-right md:text-center cursor-pointer text-lg"
                >
                  {isLoading && item._id ? (
                    <Oval
                      height={26}
                      width={26}
                      color="#000000"
                      secondaryColor="#c2c2c2"
                      visible={true}
                    />
                  ) : (
                    "X"
                  )}
                </p>
              </div>
            </Ripple>
          ))
        ) : (
          <div className="flex justify-center items-center w-full mt-15"> 
            <p className="text-center font-semibold text-gray-600 text-2xl">No products found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default List;
