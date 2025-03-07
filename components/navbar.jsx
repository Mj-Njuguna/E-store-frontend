"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import axios from "axios";
import PropTypes from "prop-types";

import MainNav from "@/components/ui/navbar/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import SearchSuggestions from "@/components/ui/search-suggestions";

const Navbar = ({ userId, categories }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize search query from URL
  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Debounced search function for suggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/search?query=${encodeURIComponent(query)}`,
          {
            timeout: 5000
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500), // Increased debounce time for better performance
    []
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) { // Only search if query is 2+ characters
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        setIsFocused(false);
      }
    }
  };

  const onSearch = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="border-b bg-white rounded-lg shadow-sm mx-4 mt-4">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl">E-Shop</p>
          </Link>
          <div className="ml-auto flex items-center space-x-4 flex-1 justify-end">
            <div ref={searchRef} className="flex-1 mx-10 max-w-3xl relative">
              <form onSubmit={onSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    className={`w-full rounded-lg border py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50 hover:bg-white transition ${
                      isFocused ? "border-black" : "border-gray-300"
                    } ${isLoading ? "opacity-70" : ""}`}
                    placeholder="Search for products..."
                  />
                  {isLoading && (
                    <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full" />
                    </div>
                  )}
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full px-6 bg-black text-white rounded-r-lg hover:bg-gray-800 transition flex items-center"
                  >
                    Search
                  </button>
                </div>
              </form>
              <SearchSuggestions
                suggestions={suggestions}
                isVisible={isFocused}
                searchQuery={searchQuery}
                onSelect={(query) => {
                  setSearchQuery(query);
                  router.push(`/search?query=${encodeURIComponent(query)}`);
                  setIsFocused(false);
                }}
              />
            </div>
            <NavbarActions />
            {userId ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="rounded-full bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800">
                  Sign in
                </button>
              </SignInButton>
            )}
          </div>
        </div>
        <div className="border-t">
          <div className="relative px-4 sm:px-6 lg:px-8 flex h-12 items-center">
            <MainNav data={categories} />
          </div>
        </div>
      </Container>
    </div>
  );
};

Navbar.propTypes = {
  userId: PropTypes.string,
  categories: PropTypes.array.isRequired
};

export default Navbar;