import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Title from "../components/Title";
import { cloudinaryUrl } from "../utils/cloudinary";

/**
 * Collections.jsx
 * Redesigned responsive collections grid with neumorphic cards + hover animations
 */

const marbleCategories = [
  {
    to: "/marbleware/kitchenware",
    title: "Kitchenware",
    img: "marble_kitchenware",
    sub: "Explore our elegant kitchenware.",
  },
  {
    to: "/marbleware/bathware",
    title: "Bathware",
    img: "marble_bathware",
    sub: "Explore our premium bathware.",
  },
  {
    to: "/marbleware/home-decors",
    title: "Home Decors",
    img: "marble_homedecor",
    sub: "Explore our artistic decor.",
  },
  {
    to: "/marbleware/designer-collection",
    title: "Designer Collection",
    img: "marble_designer_collection",
    sub: "Explore our designer pieces.",
  },
  {
    to: "/marbleware/devotional-collection",
    title: "Devotional Collection",
    img: "marble_devotional_collection",
    sub: "Explore our divine idols.",
  },
  {
    to: "/marbleware/pooja-collection",
    title: "Pooja Collection",
    img: "marble_pooja_collection",
    sub: "Explore our pooja essentials.",
  },
];

const ceramicCategories = [
  {
    to: "/ceramicware/bathware",
    title: "Bathware",
    img: "ceramic_bathware",
    sub: "Explore our ceramic bathware.",
  },
  {
    to: "/ceramicware/drinkware",
    title: "Drinkware",
    img: "ceramic_drinkware",
    sub: "Explore our crafted drinkware.",
  },
  {
    to: "/ceramicware/home-decors",
    title: "Home Decors",
    img: "ceramic_homedecors",
    sub: "Explore our ceramic decor.",
  },
  {
    to: "/ceramicware/kitchenware",
    title: "Kitchenware",
    img: "ceramic_kitchenware",
    sub: "Explore our ceramic kitchenware.",
  },
  {
    to: "/ceramicware/serveware",
    title: "Serveware",
    img: "ceramic_serveware",
    sub: "Explore our elegant serveware.",
  },
  {
    to: "/ceramicware/tableware",
    title: "Tableware",
    img: "ceramic_tableware",
    sub: "Explore our classic tableware.",
  },
];

const CategoryCard = ({ to, title, img, sub }) => {
  const imageUrl = cloudinaryUrl({
    publicId: img,
    width: 600,
    height: 400,
  });

  return (
    <Link
      to={to}
      aria-label={title}
      className="group block rounded-2xl overflow-hidden"
    >
      {/* Aspect-ratio wrapper (locks layout) */}
      <div className="relative w-full aspect-[3/2] overflow-hidden">
        {/* Optimized image (NO half loading) */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          width="600"
          height="400"
          className="
            absolute inset-0 w-full h-full object-cover
            transition-transform duration-700
            group-hover:scale-110
          "
        />

        {/* Overlay content */}
        <div className="absolute inset-0 z-10 flex items-end p-4">
          <div
            className="
              p-3 rounded-2xl backdrop-blur-xs
              transition-all duration-300
            "
          >
            <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold drop-shadow-lg">
              {title}
            </h3>
            <p className="text-xs text-white/90 mt-1 hidden sm:block drop-shadow-lg">
              {sub}
            </p>
          </div>

          {/* Chevron */}
          <span
            className="
              ml-auto p-2 rounded-full bg-white/10 backdrop-blur-md 
              text-white opacity-0 translate-y-2
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300
            "
            aria-hidden
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

const Collections = () => {
  useEffect(() => {
    const title = "Collections";
    document.title = title + " | M Crystal";
  }, []);

  return (
    <section className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      {/* MARBLE */}
      <div className="mx-auto">
        <div className="text-center py-6 pt-8 border-t border-gray-200 text-3xl">
          <Title text1={"MARBLE "} text2={"COLLECTIONS"} />
          <p className="mx-auto text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl">
            Elegantly crafted marble collections, blending tradition with
            artistry.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {marbleCategories.map((card, index) => (
            <CategoryCard key={index} {...card} />
          ))}
        </div>
      </div>

      {/* CERAMIC */}
      <div className="mx-auto mt-10">
        <div className="text-center py-6 text-3xl">
          <Title text1={"CERAMIC "} text2={"COLLECTIONS"} />
          <p className="mx-auto text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl">
            Beautiful ceramic pieces crafted for modern and traditional homes.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {ceramicCategories.map((card, index) => (
            <CategoryCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;
