"use client";
import React, { useEffect } from "react";

export default function HomePage() {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <a className="bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-700 text-center" href="/categories/parent">
          Parent Categories
        </a>
        <a className="bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-700 text-center" href="/categories/sub">
          Sub Categories
        </a>
        <a className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 text-center" href="/allproducts">
          View Products
        </a>
        <a className="bg-red-500 text-white p-4 rounded-lg shadow-md hover:bg-red-700 text-center">
          Check Orders
        </a>
        <a className="bg-purple-500 text-white p-4 rounded-lg shadow-md hover:bg-purple-700 text-center">
          Check Payments
        </a>
        <a className="bg-indigo-500 text-white p-4 rounded-lg shadow-md hover:bg-indigo-700 text-center">
          Check Transactions
        </a>
      </div>
    </div>
  );
}
