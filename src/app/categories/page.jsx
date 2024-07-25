import AllCategories from "@/components/Categories/AllCategories";
import Fotter from "@/components/HomePage/Fotter";
import Navbar from "@/components/HomePage/Navbar";

export default function Page() {
  return (
    <div>
      <Navbar />
      <AllCategories />
      <Fotter />
    </div>
  );
}
