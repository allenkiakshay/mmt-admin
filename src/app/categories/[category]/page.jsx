"use client";

import Fotter from "@/components/HomePage/Fotter";
import Navbar from "@/components/HomePage/Navbar";
import AllSubCategories from "@/components/Sub_Categories/AllSubCategories";

export default function Page({ params }) {
  return (
    <>
      <Navbar />
      <AllSubCategories category={params.category} />
      <Fotter />
    </>
  );
}
