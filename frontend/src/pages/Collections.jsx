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
  const bgImage = cloudinaryUrl({
    publicId: img,
    width: 600,
    height: 500,
  });
  return (
    <Link
      to={to}
      aria-label={title}
      className="group relative block rounded-2xl overflow-hidden"
    >
      <img
        src={bgImage}
        alt={title}
        loading="lazy"
        width="600"
        height="500"
        className="
    absolute inset-0 w-full h-full object-cover
    transition-all duration-700
    group-hover:scale-110 lg:group-hover:blur-xs
  "
      />

      {/* Neumorphic Surface */}
      <div
        className="
      relative h-48 sm:h-56 md:h-64 lg:h-56 xl:h-64 w-full
      
      rounded-2xl
      z-10
      transition-transform duration-500
      group-hover:scale-[1.02]
    "
      >
        {/* Floating Title */}
        <div
          className="absolute left-4 right-4 bottom-4 flex items-center justify-between z-20"
          aria-hidden
        >
          <div
            className="
          transform xl:translate-y-3 xl:opacity-0 p-3
          xl:group-hover:translate-y-0 xl:group-hover:opacity-100 sm:w-full rounded-2xl
          transition-all duration-400 ease-out backdrop-blur-xs xl:backdrop-blur-none
        "
          >
            <h3
              className="
            text-white text-sm sm:text-base md:text-lg font-semibold 
            drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)]
            transition-all duration-300
            lg:group-hover:scale-[1.05] lg:group-hover:brightness-110
          "
            >
              {title}
            </h3>

            <p
              className="
            text-xs text-white/90 mt-1 hidden sm:block
            drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)]
            transition-all duration-300
            group-hover:scale-[1.05]
            group-hover:brightness-125
          "
            >
              {sub}
            </p>
          </div>

          {/* Chevron icon */}
          <span
            className="
          ml-auto p-2 rounded-full bg-white/10 backdrop-blur-md 
          text-white opacity-0 translate-y-2 hover:bg-white hover:text-black
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
