import Image from "next/image";

export default function CategoryCard({ category }) {
  const handleEdit = () => {
    window.location.href = `/edit/${category.category_id}`;
  };

  const handleDisplay = () => {
    window.location.href = `/display/${category.category_id}`;
  };

  console.log(category);
  return (
    <div className="relative w-[280px] h-[350px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[300px] lg:w-[280px] lg:h-[350px] shadow-lg rounded-lg overflow-hidden">
      <div className="flex w-full h-full justify-center items-end">
        <Image
          src={category?.image_url}
          alt={category?.name}
          layout="fill"
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-0 z-30 w-full bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-t-lg flex flex-col justify-center items-center">
          <p className="font-bold text-lg text-gray-800 mb-2">
            {category?.name}
          </p>
          <div className="flex space-x-3">
            <button
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-all duration-200"
              onClick={handleDisplay}
            >
              Products
            </button>
            <button
              className="bg-green-600 hover:bg-green-800 text-white font-semibold py-1 px-3 rounded transition-all duration-200"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
