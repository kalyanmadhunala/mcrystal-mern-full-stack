const ProductImageRibbon = ({ text}) => {
  return (
    <div className="absolute top-4 -right-4 z-20 overflow-visible">
      {/* Ribbon body */}
      <span
        className="
          absolute -right-2 top-7
          w-0 h-0
          border-r-[16px] border-r-transparent
          border-l-[16px] border-l-transparent
          border-t-[16px] border-t-red-700 -rotate-90
        "
      />
      <div className="relative bg-red-700 text-white text-sm font-semibold px-5 py-2 shadow-lg ribbon-triangle-in">
        Only {text} Items left
      </div>

      {/* Ribbon tail (outside clip-path) */}
    </div>
  );
};

export default ProductImageRibbon;
