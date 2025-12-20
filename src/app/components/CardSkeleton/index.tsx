
const CardSkeleton = () => {
    return (
        <div className="min-h-[28rem] flex flex-col justify-between w-full mb-5 md:mb-5 animate-pulse">
            <div className="h-full w-full relative">
                <div className="bg-gray-200 h-full w-full rounded-t-2xl rounded-b-2xl border border-gray-100 shadow-custom-2">
                    {/* Image Placeholder */}
                    <div className='w-full h-56 bg-gray-300 rounded-t-2xl'></div>

                    <div className='p-4 bg-white rounded-bl-2xl rounded-br-2xl h-[calc(100%-14rem)] relative'>
                        <div>
                            {/* Date Placeholder */}
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            {/* Title Placeholder */}
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                            {/* Location Placeholder */}
                            <div className="h-4 bg-gray-200 rounded w-2/5"></div>
                        </div>
                        <div className="absolute bottom-[10px]">
                            {/* Price Placeholder */}
                            <div className="h-3 bg-gray-200 rounded w-10 mb-1"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardSkeleton;
