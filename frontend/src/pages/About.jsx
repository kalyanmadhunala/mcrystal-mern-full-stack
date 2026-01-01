import React, { useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  useEffect(() => {
    const title = "About";
    document.title = title + " | M Crystal";
  }, []);
  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div>
        <div className="text-2xl text-center pt-8 border-t border-gray-200">
          <Title text1={"ABOUT"} text2={"US"} />
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-16">
          <img
            className="w-full md:max-w-[450px]"
            src={assets.about_us}
            alt="about"
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
            <p>
              At M Crystal, we believe that every home deserves décor that tells
              a story. Our journey began with a simple vision — to bring
              timeless craftsmanship and modern design together, creating pieces
              that elevate the beauty of everyday living.
            </p>

            <p>
              M Crystal is more than a home-decor brand — it's a celebration of
              heritage, creativity, and the joy of transforming spaces into
              experiences. We bring you décor that feels personal, meaningful,
              and built to last.
            </p>
            <b>Our Mission</b>
            <p>
              Our mission is to inspire homes with beautifully crafted pieces
              that blend tradition with contemporary style. We are committed to:
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                Delivering premium-quality products using ethically sourced
                materials
              </li>
              <li>
                Supporting local artisans and preserving traditional
                craftsmanship
              </li>
              <li>
                Providing a seamless and trustworthy shopping experience for
                every customer
              </li>
            </ul>
          </div>
        </div>
        <div className="text-xl py-4 mt-8">
          <Title text1={"WHY"} text2={"CHOOSE US"} />
        </div>

        <div className="flex flex-col md:flex-row text-sm mb-20">
          <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Quality Assurance:</b>
            <p className="text-gray-600">We ensure every product meets the highest standards of craftsmanship, durability, and finish.</p>
          </div>
          <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Convenience:</b>
            <p className="text-gray-600">We offer a seamless shopping experience with easy browsing, quick checkout, and reliable delivery.</p>
          </div>
          <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
            <b>Exceptional Customer Service:</b>
            <p className="text-gray-600">We provide prompt, friendly support to make every step of your shopping experience effortless.</p>
          </div>
        </div>
        <NewsletterBox/>
      </div>
    </div>
  );
};

export default About;
