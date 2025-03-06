/**
 * Get a single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Category data
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id) => {
  const res = await fetch(`${URL}/${id}`);

  return res.json();
};

export default getCategory;
