/**
 * Get all available colors
 * @returns {Promise<Array>} Array of color objects
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/colors`;

const getColors = async () => {
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      console.error(`Failed to fetch colors: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
};

export default getColors;
