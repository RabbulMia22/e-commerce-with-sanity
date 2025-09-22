
import Banner from "@/components/Banner";
import ProductView from "@/components/ProductView";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";



export default async function Home() {
  const products = await getAllProducts();
  
  return (
   <div className="container mx-auto ">
     <Banner />
     <ProductView products={products} />
   </div>
  );
}
