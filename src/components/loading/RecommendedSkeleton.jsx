const RecommendedSkeleton = () => (
    <div className="grid grid-cols-6 gap-4 mt-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded"></div>
          <div className="mt-1 h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )

export default RecommendedSkeleton