import Fotter from "@/components/HomePage/Fotter";
import Navbar from "@/components/HomePage/Navbar";
import CreateProduct from "@/components/Products/CreateProduct";

export default function Page() {
  return (
    <div>
      <Navbar />
      <CreateProduct />
      <Fotter />
    </div>
  );
}
