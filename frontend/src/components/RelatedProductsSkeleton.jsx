const RelatedProductsSkeleton = () => {
  return (
    <div className="mt-16 ">
      <div className="h-10 w-80 shimmer rounded mb-6 flex justify-self-center" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-55 shimmer rounded" />
            <div className="h-4 w-3/4 shimmer rounded" />
            <div className="h-4 w-1/2 shimmer rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsSkeleton;
