"use client";
import { uploadFileToS3 } from "@/lib/UploadImage";
import { useState } from "react";

const CategoryCreate = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [categoryid, setCategoryid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await uploadFileToS3(image);
    console.log("Result:", result);

    setCategoryName("");
    setDescription("");
    setImage(null);
    setCategoryid("");
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex w-full h-fit px-10 md:px-20 lg:px-25 py-4 bg-gray-100">
      <div className="w-full">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col gap-4 w-full md:w-8/12 h-fit m-2">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Create Category</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label
                    htmlFor="categoryId"
                    className="text-lg font-semibold mb-2"
                  >
                    Category ID
                  </label>
                  <input
                    type="text"
                    id="categoryId"
                    value={categoryid}
                    onChange={(e) => setCategoryid(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Category ID"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="categoryName"
                    className="text-lg font-semibold mb-2"
                  >
                    Category Name
                  </label>
                  <input
                    type="text"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Category Name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className="text-lg font-semibold mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-[100px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="image" className="text-lg font-semibold mb-2">
                    Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    className="w-full h-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Create Category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
