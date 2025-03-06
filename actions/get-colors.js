/**
 * Get all available colors
 * @returns {Promise<Array>} Array of color objects
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/colors`;

const getColors = async () => {
  const res = await fetch(URL);

  return res.json();
};

export default getColors;
