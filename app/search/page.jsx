import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Score a product against a set of keywords.
 * Higher score = better match. Score of 0 = no match.
 */
function scoreProduct(product, keywords) {
  let score = 0;
  const name = product.name?.toLowerCase() ?? "";
  const category = product.category?.name?.toLowerCase() ?? "";

  for (const kw of keywords) {
    if (name === kw) score += 10;           // exact name match
    else if (name.startsWith(kw)) score += 7; // name starts with keyword
    else if (name.includes(kw)) score += 5;   // name contains keyword

    if (category === kw) score += 8;          // exact category match
    else if (category.includes(kw)) score += 3; // category contains keyword
  }

  return score;
}

/**
 * Try the dedicated search endpoint first.
 * If it doesn't exist (404) or fails, fall back to fetching all products
 * and scoring them client-side.
 */
async function searchProducts(query) {
  if (!query?.trim()) return [];

  const keywords = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  // --- Attempt 1: dedicated search endpoint ---
  try {
    const res = await fetch(
      `${API_URL}/products/search?query=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // endpoint doesn't exist or network error — fall through to fallback
  }

  // --- Attempt 2: fetch all products and score locally ---
  try {
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    if (!res.ok) return [];

    const allProducts = await res.json();
    if (!Array.isArray(allProducts)) return [];

    return allProducts
      .map((product) => ({ product, score: scoreProduct(product, keywords) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);
  } catch {
    return [];
  }
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.query || "";
  const products = await searchProducts(query);

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 sm:px-6 lg:px-8 pb-24 pt-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-1">
            {query ? `Results for "${query}"` : "All Products"}
          </h2>
          {query && (
            <p className="text-gray-500 mb-6">
              {products.length} {products.length === 1 ? "result" : "results"} found
            </p>
          )}
          {products.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((item) => (
                <ProductCard key={item.id} data={item} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
