/**
 * Get a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object|null>} Product data or null
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id) => {
  if (!id) {
    console.error("Missing product ID parameter");
    return null;
  }

  try {
    const res = await fetch(`${URL}/${id}`);

    if (!res.ok) {
      console.error(`Failed to fetch product: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export default getProduct;
