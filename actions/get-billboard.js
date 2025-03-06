/**
 * Get a billboard by ID
 * @param {string} id - Billboard ID
 * @returns {Promise<Object|null>} Billboard data or null
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id) => {
  try {
    const res = await fetch(`${URL}/${id}`);
    
    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching billboard:', error);
    return null;
  }
};

export default getBillboard;
