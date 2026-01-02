const shimmer =
  "relative overflow-hidden bg-gray-200 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent shimmer rounded";

const ProductSkeleton = () => {
  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div className="border-t border-gray-200 pt-10">
        <div className="flex gap-12 flex-col sm:flex-row">
          <div className="flex-1 flex gap-3">
            <div className="hidden sm:flex flex-col gap-4 w-[18%]">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 shimmer rounded" />
              ))}
            </div>
            <div className="w-full sm:w-[80%] h-[450px] shimmer rounded" />
          </div>

          <div className="flex-1 space-y-8">
            <div className="h-12 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/3 shimmer rounded" />
            <div className="h-10 w-1/2 shimmer rounded" />
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-5/6 shimmer rounded" />
            <div className="h-12 w-40 shimmer rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
