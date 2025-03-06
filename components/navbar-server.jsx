import { auth } from "@clerk/nextjs/server";
import getCategories from "@/actions/get-categories";
import Navbar from "./navbar";

/**
 * Server component for the navbar
 */
async function NavbarServer() {
  const { userId } = await auth();
  const categories = await getCategories();

  return <Navbar userId={userId} categories={categories} />;
}

export default NavbarServer;
