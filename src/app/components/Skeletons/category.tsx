
import './styles.css';

const CategorySkeleton = () => {
    return (
        <div className="relative z-0 animate-pulse">
            {/* Icon Box */}
            <div className='flex justify-center bg-gray-200 p-5 py-6 rounded w-10/12 mx-auto relative z-50 h-24'>
                <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
            </div>
            {/* Text Box */}
            <div className='bg-[#F6F6F6] pt-7 p-4 relative -top-5 z-0 rounded h-24'>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="flex items-center">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    );
};

export default CategorySkeleton;
