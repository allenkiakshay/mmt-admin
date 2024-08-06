"use client";

import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";

export default function AllSubCategories({ category }) {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const result = await fetch("/api/sub-category/fetch", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          category: category,
        },
      });

      if (result.status === 200) {
        const data = await result.json();
        setCategories(data.data);
      }
    };

    fetchCategories();
  }, [category]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const isTokenExpired = Date.now() >= decodedToken.exp * 1000;

      if (isTokenExpired) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        // setSignin(true);
      } else {
        // setSignin(false);
      }
    } else {
      window.location.href = "/login";
      // setSignin(true);
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="justify-between flex items-center">
        <h1 className="text-3xl font-bold mb-4">Sub Category - {category}</h1>
        <a
          href="/categories/create/sub"
          className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          {" "}
          Add Sub Category{" "}
        </a>
      </div>
      <div className="flex flex-wrap gap-10">
        {categories?.map((category, key) => (
          <CategoryCard key={key} category={category} />
        ))}
      </div>
    </div>
  );
}
