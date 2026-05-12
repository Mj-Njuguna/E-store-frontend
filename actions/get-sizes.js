/**
 * Get all available sizes
 * @returns {Promise<Array>} Array of size objects
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async () => {
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      console.error(`Failed to fetch sizes: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
};

export default getSizes;
