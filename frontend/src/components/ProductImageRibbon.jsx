const ProductImageRibbon = ({ text}) => {
  return (
    <div className="absolute top-4 -left-4 z-20 overflow-visible">
      {/* Ribbon body */}
      <span
        className="
          absolute left-0 top-5
          w-0 h-0
          border-t-[18px] border-t-transparent
          border-b-[16px] border-b-transparent
          border-l-[16px] border-r-red-700
          rotate-180
        "
      />
      <div className="relative bg-red-700 text-white text-sm font-semibold px-5 py-2 shadow-lg ribbon-triangle-in-left">
        Only {text} Unit{text !== 1 ? "s": ""} left
      </div>

      {/* Ribbon tail (outside clip-path) */}
    </div>
  );
};

export default ProductImageRibbon;
