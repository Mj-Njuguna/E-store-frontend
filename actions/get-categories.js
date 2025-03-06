/**
 * Get all categories
 * @returns {Promise<Array>} Array of categories
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async () => {
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export default getCategories;
