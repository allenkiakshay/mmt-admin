"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";

export default function AllCategories() {
  const [categories, setCategories] = useState([]);
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

  const categoriesData = [
    {
      id: 1,
      name: "Category 1",
      description: "This is category 1 description",
      image:
        "https://mahesh-mens-touch.s3.ap-south-1.amazonaws.com/1721837693350-Screenshot+from+2024-07-24+18-04-07.png",
    },
    {
      id: 2,
      name: "Category 2",
      description: "This is category 2 description",
      image:
        "https://mahesh-mens-touch.s3.ap-south-1.amazonaws.com/1721837693350-Screenshot+from+2024-07-24+18-04-07.png",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Categories</h1>
      <div className="flex flex-wrap gap-10">
        {categories?.map((category,key) => (
          <CategoryCard key={key} category={category} />
        ))}
      </div>
    </div>
  );
}
