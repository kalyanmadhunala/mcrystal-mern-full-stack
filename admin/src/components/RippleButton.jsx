import React, { useRef } from "react";

const Ripple = ({ children, onClick, customClass, ...props }) => {
  const containerRef = useRef(null);

  const handleClick = (e) => {
    const el = containerRef.current;
    const circle = document.createElement("span");
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      e.clientX - el.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      e.clientY - el.getBoundingClientRect().top - radius
    }px`;
    circle.classList.add("ripple");

    const ripple = el.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    el.appendChild(circle);

    if (onClick) onClick(e); // call any passed click function
  };

  return (
    <div
      ref={containerRef}
      className={`ripple-container relative overflow-hidden ${customClass}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Ripple;
