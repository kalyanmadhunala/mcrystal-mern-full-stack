const RelatedProductsSkeleton = () => {
  return (
    <div className="mt-16 px-4 sm:px-[3vw] md:px-[5vw] lg:px-[7vw]">
      <div className="h-8 w-64 shimmer rounded mb-6 mx-auto" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-56 shimmer rounded" />
            <div className="h-4 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/2 shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSkeleton;
