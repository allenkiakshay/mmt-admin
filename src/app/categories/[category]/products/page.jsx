import Fotter from "@/components/HomePage/Fotter";
import Navbar from "@/components/HomePage/Navbar";
import AllProducts from "@/components/Products/allproducts";

export default function Page() {
  return (
    <div>
      <Navbar />
      <AllProducts />
      <Fotter />
    </div>
  );
}
