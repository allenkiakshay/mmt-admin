"use client";
import Fotter from "@/components/HomePage/Fotter";
import Navbar from "@/components/HomePage/Navbar";
import AllProducts from "@/components/Products/subproducts";

export default function Page({ params }) {
  return (
    <div>
      <Navbar />
      <AllProducts
        category={params.category}
        sub_category={params.subcategory}
      />
      <Fotter />
    </div>
  );
}
