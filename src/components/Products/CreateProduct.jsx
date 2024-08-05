"use client";
import { uploadFileToS3 } from "@/lib/UploadImage";
import { useEffect, useState } from "react";

export default function CreateProduct() {
  const [parentCategory, setParentCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [productid, setProductid] = useState("");
  const [mrp, setMrp] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [sizes, setSizes] = useState([{ size: "", quantity: "", price: "" }]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await fetch("/api/parent-category/fetch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      if (result.status === 200) {
        const data = await result.json();
        setCategories(data.data);
      }
    };

    fetchCategories();
  }, []);

  const fetchSubCategories = async (id) => {
    const result = await fetch(`/api/sub-category/fetch`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        category: id,
      },
    });
    if (result.status === 200) {
      const data = await result.json();
      setSubCategories(data.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageUrls = await Promise.all(
      images.map((image) => uploadFileToS3(image))
    );

    const result = await fetch("/api/products/create", {
      method: "POST",
      body: JSON.stringify({
        parentcategoryId: parentCategory,
        productName: productName,
        description: description,
        images: imageUrls,
        subcategoryId: subCategory,
        productid: productid,
        mrp: mrp,
        length: length,
        width: width,
        height: height,
        weight: weight,
        sizes: sizes,
      }),
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });

    if (result.status === 200) {
      alert("Product created successfully");
    }

    window.location.href = `/categories/${parentCategory}/products`;
    setProductName("");
    setDescription("");
    setImages([]);
    setProductid("");
    setMrp("");
    setLength("");
    setWidth("");
    setHeight("");
    setWeight("");
    setSizes([{ size: "", quantity: "", price: "" }]);
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length > 5) {
      alert("You can only upload a maximum of 5 images");
      return;
    }

    setImages(selectedFiles);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

      if (isTokenExpired) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleAddSize = () => {
    setSizes([...sizes, { size: "", quantity: "", price: "" }]);
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = sizes.map((size, i) =>
      i === index ? { ...size, [field]: value } : size
    );
    setSizes(newSizes);
  };

  const handleRemoveSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  return (
    <div className="flex w-full h-fit px-10 md:px-20 lg:px-25 py-4 bg-gray-100">
      <div className="w-full">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col gap-4 w-full md:w-8/12 h-fit m-2">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Create Product</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label
                    htmlFor="parentCategory"
                    className="text-lg font-semibold mb-2"
                  >
                    Parent Category
                  </label>
                  <select
                    id="parentCategory"
                    value={parentCategory}
                    onChange={(e) => {
                      setParentCategory(e.target.value),
                        fetchSubCategories(e.target.value);
                    }}
                    className="w-full h-fit border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select Parent Category</option>
                    {categories?.map((category, key) => (
                      <option key={key} value={category.category_id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {subcategories?.length > 0 ? (
                  <div className="flex flex-col">
                    <label
                      htmlFor="subCategory"
                      className="text-lg font-semibold mb-2"
                    >
                      Sub Category
                    </label>
                    <select
                      id="subCategory"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full h-fit border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                      required
                    >
                      <option value="">Select Sub Category</option>
                      {subcategories?.map((category, key) => (
                        <option key={key} value={category.sub_category_id}>
                          {category.sub_category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
                <div className="flex flex-col">
                  <label
                    htmlFor="productid"
                    className="text-lg font-semibold mb-2"
                  >
                    Product ID
                  </label>
                  <input
                    type="text"
                    id="productid"
                    value={productid}
                    onChange={(e) => setProductid(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product ID"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="productName"
                    className="text-lg font-semibold mb-2"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Product Name"
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
                  <label
                    htmlFor="images"
                    className="text-lg font-semibold mb-2"
                  >
                    Images (max 5)
                  </label>
                  <input
                    type="file"
                    id="images"
                    multiple
                    onChange={handleImageChange}
                    className="w-full h-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="mrp" className="text-lg font-semibold mb-2">
                    MRP
                  </label>
                  <input
                    type="number"
                    id="mrp"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="MRP"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="length"
                    className="text-lg font-semibold mb-2"
                  >
                    Length
                  </label>
                  <input
                    type="number"
                    id="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Length (in CM)"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="width" className="text-lg font-semibold mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    id="width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Width (in CM)"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="height"
                    className="text-lg font-semibold mb-2"
                  >
                    Height
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Height (in CM)"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="weight"
                    className="text-lg font-semibold mb-2"
                  >
                    Weight
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Weight (in KG)"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sizes" className="text-lg font-semibold mb-2">
                    Sizes
                  </label>
                  {sizes.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Size"
                        value={size.size}
                        onChange={(e) =>
                          handleSizeChange(index, "size", e.target.value)
                        }
                        className="w-1/2 h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={size.quantity}
                        onChange={(e) =>
                          handleSizeChange(index, "quantity", e.target.value)
                        }
                        className="w-1/2 h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) =>
                          handleSizeChange(index, "price", e.target.value)
                        }
                        className="w-1/2 h-[40px] border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="text-red-500 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    Add Size
                  </button>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Create Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
