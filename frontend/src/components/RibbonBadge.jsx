const RibbonBadge = ({ text }) => {
  return (
    <div className="absolute top-2 -right-2 z-10">
    <span
        className="
          absolute -right-1 top-5
          w-0 h-0
          border-r-[8px] border-r-transparent
          border-l-[8px] border-l-transparent
          border-t-[8px] border-t-red-700 -rotate-90
        "
      />
      {/* Ribbon body (clipped) */}
      <div className="relative bg-red-700 text-white text-xs font-semibold px-3 py-1 shadow-md ribbon-triangle-in">
        Only {text} left
      </div>      
    </div>
  );
};

export default RibbonBadge;
