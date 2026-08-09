import React from 'react'

const BookingSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 border border-slate-100 rounded-2xl animate-pulse">
      
      {/* Image */}
      <div className="w-full md:w-40 h-32 bg-gray-200 rounded-xl"></div>

      <div className="flex-1 space-y-4">
        
        {/* Title + Price */}
        <div className="flex justify-between">
          <div className="space-y-2 w-2/3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Status */}
        <div className="h-6 bg-gray-200 rounded w-24 mt-2"></div>
      </div>
    </div>
  )
}

export default BookingSkeleton
