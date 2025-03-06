import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

/**
 * Fetch and filter products based on search query
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Filtered products array
 */
async function getProducts(query) {
  try {
    // Split the search query into keywords
    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Fetch all products
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    const allProducts = await response.json();

    // Filter and score products based on keyword matches
    const scoredProducts = allProducts.map((product) => {
      let score = 0;
      const searchableText =
        `${product.name} ${product.category?.name} ${product.description}`.toLowerCase();

      // Score each keyword match
      keywords.forEach((keyword) => {
        // Exact matches get higher scores
        if (product.name.toLowerCase() === keyword) score += 10;
        if (product.category?.name.toLowerCase() === keyword) score += 8;

        // Partial matches in name get medium scores
        if (product.name.toLowerCase().includes(keyword)) score += 5;

        // Partial matches in category or description get lower scores
        if (searchableText.includes(keyword)) score += 2;
      });

      return { product, score };
    });

    // Filter out products with no matches and sort by score
    const filteredProducts = scoredProducts
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    return filteredProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Search page component
 * @param {Object} props Component props
 * @param {Object} props.searchParams URL search parameters
 * @param {string} props.searchParams.query Search query string
 */
export default async function SearchPage({ searchParams }) {
  const products = await getProducts(searchParams.query || "");

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <div className="mt-6 lg:col-span-5">
              <div className="lg:col-span-5">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
                  Search Results for &quot;{query}&quot;
                </h2>
                {products.length === 0 ? (
                  <NoResults />
                ) : (
                  <>
                    <p className="text-gray-500 mb-4">
                      {products.length} results found
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {products.map((item) => (
                        <ProductCard key={item.id} data={item} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
