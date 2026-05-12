"use client";

import Image from "next/image";
import PropTypes from "prop-types";

const SearchSuggestions = ({ suggestions, isVisible, onSelect, searchQuery }) => {
  // Only show when focused AND user has typed something AND there's something to show
  if (!isVisible || searchQuery.length < 2) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto z-50">
      {suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((product) => (
            <button
              key={product.id}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
              // Fix Bug 2: call onSelect so the navbar syncs the input value
              onMouseDown={(e) => {
                // onMouseDown + preventDefault prevents the input from losing focus
                // before the click registers, which would close the dropdown first
                e.preventDefault();
                onSelect(product.name, product.id);
              }}
            >
              <div className="w-10 h-10 relative flex-shrink-0">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="40px"
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.category?.name}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          <p>No products found for &quot;{searchQuery}&quot;</p>
          <p className="text-sm mt-1">Try different keywords</p>
        </div>
      )}
    </div>
  );
};

SearchSuggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

export default SearchSuggestions;
