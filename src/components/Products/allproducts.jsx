"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchproducts = async () => {
      const result = await fetch("/api/products/fetchall", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });

      if (result.status === 200) {
        const data = await result.json();
        setProducts(data.data);
      }
    };

    fetchproducts();
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

  return (
    <div className="container mx-auto p-4">
      <div className="justify-between flex items-center">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <a
          href="/categories/create/product"
          className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-700"
        >
          {" "}
          Add Products{" "}
        </a>
      </div>
      <div className="flex flex-wrap gap-10">
        {products?.map((product, key) => (
          <ProductCard key={key} product={product} />
        ))}
      </div>
    </div>
  );
}
