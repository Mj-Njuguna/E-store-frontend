"use client";
import Link from "next/link";
import { Search } from "lucide-react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PropTypes from "prop-types";

import MainNav from "@/components/ui/navbar/main-nav";
import Container from "@/components/ui/container";
import NavbarActions from "@/components/navbar-actions";
import SearchSuggestions from "@/components/ui/search-suggestions";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

const Navbar = ({ userId, categories }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  // Fix Bug 4: stable debounce timer ref — never recreated
  const debounceTimer = useRef(null);

  // Fix Bug 6: removed useSearchParams — read from URL directly on mount only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query");
    if (q) setSearchQuery(q);
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fix Bug 4: plain ref-based debounce, no useCallback/debounce library needed
  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      // Try dedicated endpoint first, fall back to /products
      let products = [];
      const searchRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/search?query=${encodeURIComponent(query)}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (searchRes.ok) {
        const data = await searchRes.json();
        if (Array.isArray(data)) products = data;
      }

      // Fallback: score against all products locally
      if (products.length === 0) {
        const allRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (allRes.ok) {
          const all = await allRes.json();
          if (Array.isArray(all)) {
            const kw = query.toLowerCase();
            products = all
              .filter((p) =>
                p.name?.toLowerCase().includes(kw) ||
                p.category?.name?.toLowerCase().includes(kw)
              )
              .slice(0, 8); // cap suggestions at 8
          }
        }
      }

      setSuggestions(products.slice(0, 8));
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fix Bug 4: clear previous timer, set new one
    clearTimeout(debounceTimer.current);

    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(() => fetchSuggestions(query), DEBOUNCE_MS);
  };

  const submitSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    // Fix Bug 3: clear suggestions AND focused state before navigating
    setSuggestions([]);
    setIsFocused(false);
    clearTimeout(debounceTimer.current);
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSearch(searchQuery);
    }
    // Fix Bug 1: Escape closes the dropdown
    if (e.key === "Escape") {
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  // Fix Bug 2: onSelect receives both name (to sync input) and id (to navigate)
  const handleSuggestionSelect = (name, productId) => {
    setSearchQuery(name);
    setSuggestions([]);
    setIsFocused(false);
    clearTimeout(debounceTimer.current);
    router.push(`/product/${productId}`);
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
                onSelect={handleSuggestionSelect}
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
  categories: PropTypes.array.isRequired,
};

export default Navbar;