"use client";

import Image from "next/image";
import PropTypes from "prop-types";

/**
 * Splits `text` into segments, wrapping parts that match any keyword in a
 * <mark> so the user can see exactly why a suggestion appeared.
 *
 * e.g. text="Wool Cashmere Jacket", query="wool jack"
 *   → ["", <mark>Wool</mark>, " Cashmere ", <mark>Jack</mark>, "et"]
 */
function HighlightedText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;

  const keywords = query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    // longest keywords first so overlapping matches don't get swallowed
    .sort((a, b) => b.length - a.length);

  // Build a regex that matches any keyword (case-insensitive)
  const pattern = keywords.map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");

  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 text-gray-900 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

HighlightedText.propTypes = {
  text: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
};

const SearchSuggestions = ({ suggestions, isVisible, onSelect, searchQuery }) => {
  if (!isVisible || searchQuery.length < 2) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white mt-1 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-auto z-50">
      {suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((product) => (
            <button
              key={product.id}
              className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(product.name, product.id);
              }}
            >
              <div className="w-10 h-10 relative flex-shrink-0 rounded overflow-hidden bg-gray-100">
                {product.images?.[0]?.url ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  <HighlightedText text={product.name} query={searchQuery} />
                </p>
                <p className="text-xs text-gray-400 truncate">{product.category?.name}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500 text-sm">
          No results for &quot;{searchQuery}&quot;
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
