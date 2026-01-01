import React from "react";

const SlideTransition = ({ show, children }) => {
  return (
    <div className="grid grid-cols-1">
      <div
        className={`
          col-start-1 col-end-2 row-start-1 row-end-2
          transition-all duration-500 ease-in-out
          ${show 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-full"
          }
        `}
      >
        {children}
      </div>

      {/* Invisible clone maintains exact height */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 opacity-0 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default SlideTransition;
