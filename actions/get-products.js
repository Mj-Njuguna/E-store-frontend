import qs from "query-string";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/products`;

/**
 * Get products with optional filtering
 * @param {Object} query - Query parameters
 * @param {string} [query.categoryId] - Category ID to filter by
 * @param {string} [query.colorId] - Color ID to filter by
 * @param {string} [query.sizeId] - Size ID to filter by
 * @param {boolean} [query.isFeatured] - Whether to get featured products only
 * @returns {Promise<Array>} Array of products
 */
const getProducts = async (query = {}) => {
  try {
    const url = qs.stringifyUrl({
      url: URL,
      query: { 
        colorId: query.colorId,
        sizeId: query.sizeId,
        categoryId: query.categoryId,
        isFeatured: query.isFeatured,
      },
    });

    const res = await fetch(url);

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default getProducts;
