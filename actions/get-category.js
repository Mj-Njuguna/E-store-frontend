/**
 * Get a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category data
 */
const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id) => {
  if (!id) {
    console.error("Missing category ID parameter");
    return { name: "Not Found", billboard: { label: "Category Not Found" } };
  }

  try {
    const res = await fetch(`${URL}/${id}`, { 
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch category: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return { name: "Error", billboard: { label: "Error Loading Category" } };
  }
};

export default getCategory;