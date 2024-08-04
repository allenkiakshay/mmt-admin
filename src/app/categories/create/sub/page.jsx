import Fotter from "@/components/HomePage/Fotter";
import Navbar from "@/components/HomePage/Navbar";
import CategoryCreate from "@/components/Sub_Categories/createsubCategory";

export default function Page() {
  return (
    <>
      <Navbar />
      <CategoryCreate/>
      <Fotter />
    </>
  );
}
