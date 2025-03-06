"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define the Product interface directly in this file
interface Product {
  id: string;
  name: string;
  images: { url: string }[];
  category?: {
    name: string;
  };
}

interface SearchSuggestionsProps {
  suggestions: Product[];
  isVisible: boolean;
  onSelect: (query: string) => void;
  searchQuery: string;
}

const SearchSuggestions = ({
  suggestions,
  isVisible,
  onSelect,
  searchQuery,
}: SearchSuggestionsProps) => {
  const router = useRouter();

  if (!isVisible || !searchQuery) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto z-50">
      {suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((product) => (
            <button
              key={product.id}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
              onClick={() => {
                router.push(`/product/${product.id}`);
              }}
            >
              <div className="w-10 h-10 relative">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  sizes="40px"
                  className="object-cover rounded"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">
                  {product.category?.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p>No products found for &quot;{searchQuery}&quot;</p>
          <p className="text-sm mt-1">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;