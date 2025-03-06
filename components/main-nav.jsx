"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils"
import { CategoryPropType } from "@/types";

/**
 * Main navigation component for category links
 */
const MainNav = ({
  data
}) => {
  const pathname = usePathname();

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <nav
      className="mx-6 flex items-center space-x-4 lg:space-x-6"
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-black',
            route.active ? 'text-black' : 'text-neutral-500'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};

MainNav.propTypes = {
  data: PropTypes.arrayOf(CategoryPropType).isRequired
};

export default MainNav;
