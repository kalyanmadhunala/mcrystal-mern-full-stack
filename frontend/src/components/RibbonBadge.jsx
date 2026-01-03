const RibbonBadge = ({ text }) => {
  return (
    <div className="absolute top-3 -left-2 z-10">
      {/* Triangle fold */}
      <span
        className="
          absolute left-0 top-4
          w-0 h-0
          border-t-[12px] border-t-transparent
          border-b-[8px] border-b-transparent
          border-l-[8px] border-r-red-700
          rotate-180
        "
      />

      {/* Ribbon body */}
      <div className="relative bg-red-700 text-white text-xs font-semibold px-4 py-1 shadow-md ribbon-triangle-in-left">
        Only {text} left
      </div>
    </div>
  );
};

export default RibbonBadge;
