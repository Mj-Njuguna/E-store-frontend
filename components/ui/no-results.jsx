import { SearchX } from "lucide-react";

/**
 * No results component displayed when search or filtering returns no items
 */
const NoResults = () => {
  return (
    <div className="flex flex-col items-center justify-center h-60 space-y-4">
      <SearchX className="h-12 w-12 text-gray-400" />
      <div className="text-center">
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          No results found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          We couldn&apos;t find what you&apos;re looking for. Try searching with different
          keywords.
        </p>
      </div>
    </div>
  );
};

export default NoResults;
