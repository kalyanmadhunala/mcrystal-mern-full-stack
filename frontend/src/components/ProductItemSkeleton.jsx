import React from "react";

const ProductItemSkeleton = ({index}) => {
  return (
    <div key={index} className="relative block animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden">
        <div className="w-full aspect-square bg-gray-200 shimmer rounded-sm" />
      </div>

      {/* Text Skeletons */}
      <div className="pt-3 space-y-2">
        <div className="h-3 bg-gray-200 shimmer rounded w-4/5" />
        <div className="flex gap-2 items-center">
          <div className="h-4 bg-gray-200 shimmer rounded w-12" />
          <div className="h-3 bg-gray-200 shimmer rounded w-16" />
          <div className="h-3 bg-gray-200 shimmer rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export default ProductItemSkeleton;
