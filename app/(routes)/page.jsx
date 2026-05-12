import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const metadata = {
  title: "Home | E-Shop",
  description: "Discover our featured products and latest collections",
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts({ isFeatured: true });
  const billboard = await getBillboard(process.env.NEXT_PUBLIC_BILLBOARD_ID);

  return (
    <Container>
      <div className="space-y-10 pb-10">
        {billboard && (
          <Billboard 
            data={billboard}
          />
        )}
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  )
}
