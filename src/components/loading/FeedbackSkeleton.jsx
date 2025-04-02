import React from 'react'

const FeedbackSkeleton = () => (
    <div className="animate-pulse">
        {[...Array(3)].map((_, index) => (
            <div key={index} className="mt-4 p-4 border rounded">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="mt-2 h-4 bg-gray-200 rounded"></div>
                <div className="mt-1 h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
        ))}
    </div>
)

export default FeedbackSkeleton