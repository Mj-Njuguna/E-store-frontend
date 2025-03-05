import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MainNavProps {
  data: Category[];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  const pathname = usePathname();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  
  // Split categories into main display and overflow
  const mainCategories = data.slice(0, 5);
  const overflowCategories = data.slice(5);

  const routes = mainCategories.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 relative">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-black",
            route.active ? "text-black" : "text-neutral-500"
          )}
        >
          {route.label}
        </Link>
      ))}
      
      {overflowCategories.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="flex items-center space-x-1 text-sm font-medium text-neutral-500 hover:text-black transition-colors"
          >
            <Menu size={20} />
            <span>More</span>
          </button>
          
          <AnimatePresence>
            {isMoreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1">
                  {overflowCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </nav>
  );
};

export default MainNav;
