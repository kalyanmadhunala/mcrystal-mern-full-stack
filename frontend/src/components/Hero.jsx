import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import SplitText from "../animations/SplitText";
import AnimatedContent from "../animations/AnimateContent";
import FadeContent from "../animations/FadeContent";
import { ShopContext } from "../context/ShopContext";

const Hero = () => {
  const { navigate } = useContext(ShopContext);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 1) {
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY && currentScrollY < 1) {
        setIsScrolled(false);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="grid w-full h-screen">
      {/* Background Image (Desktop) */}
      <img
        src="https://res.cloudinary.com/dbanrkx7w/image/upload/w_auto,dpr_auto,f_auto,q_auto/desktopheroimg"
        alt="Hero background"
        className={`hidden lg:block absolute inset-0 w-full h-full object-cover transition-all ${
          isScrolled ? "rounded-b-4xl" : ""
        }`}
        width="1920"
        height="1080"
        loading="eager"
      />

      {/* Background Image (Mobile) */}
      <img
        src="https://res.cloudinary.com/dbanrkx7w/image/upload/w_auto,dpr_auto,f_auto,q_auto/mobileheroimg"
        alt="Hero background mobile"
        className={`block lg:hidden absolute inset-0 w-full h-full object-cover transition-all ${
          isScrolled ? "rounded-b-4xl" : ""
        }`}
        width="1080"
        height="1920"
        loading="eager"
      />

      <div
        className="relative z-10 flex h-full px-6 sm:px-10 ml-5 lg:ml-15
                      items-start lg:items-center"
      >
        <div className="text-white max-w-lg mt-34 lg:mt-0">
          <SplitText
            tag="h1"
            text="Turn Your Home into a Living Gallery"
            className="text-4xl sm:text-5xl lg:text-5xl font-bold"
            delay={10}
            duration={2}
            ease="elastic.out(1,0,3)"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="start"
          />
          <AnimatedContent
            distance={20}
            direction="vertical"
            reverse={false}
            duration={1.5}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={1}
            threshold={0.2}
            delay={1}
          >
            <div>
              <p className="mt-10 text-lg sm:text-xl">
                Where every corner tells a story — discover the charm of marble
                and ceramic masterpieces
              </p>
            </div>
          </AnimatedContent>
          <FadeContent
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
            delay={1200}
          >
            <button
              onClick={() => navigate("/collections")}
              className="mt-6 px-6 py-3 text-primary bg-secondary hover:text-white hover:bg-primary rounded-lg font-medium cursor-pointer"
            >
              Explore Now
            </button>
          </FadeContent>
        </div>
      </div>
    </section>
  );
};

export default Hero;
