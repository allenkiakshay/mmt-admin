import Image from "next/image";

export default function ProductCard({ product }) {
  const handleEdit = () => {
    window.location.href = `/edit/${product.sub_category_id}`;
  };

  const handleDisplay = () => {
    window.location.href = `/categories/edit/product/${product.product_id}`;
  };

  return (
    <div className="relative w-[280px] h-[350px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[300px] lg:w-[280px] lg:h-[350px] shadow-lg rounded-lg overflow-hidden">
      <div className="flex w-full h-full justify-center items-end">
        <Image
          src={product?.image_link}
          alt={product?.product_name}
          layout="fill"
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-0 z-30 w-full bg-white bg-opacity-80 backdrop-blur-md p-4 rounded-t-lg flex flex-col justify-center items-center">
          <p className="font-bold text-lg text-gray-800 mb-2">
            {product?.product_name}
          </p>
          <div className="flex space-x-3">
            <button
              className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-700"
              onClick={handleDisplay}
            >
              Edit Product
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-lg shadow-md hover:bg-red-700"
              onClick={handleEdit}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
