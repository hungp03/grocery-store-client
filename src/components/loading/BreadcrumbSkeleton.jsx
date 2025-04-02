import React from 'react'

const BreadcrumbSkeleton = () => {
    return (
        <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
    )
}

export default BreadcrumbSkeleton