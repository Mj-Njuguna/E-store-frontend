/**
 * Get all available sizes
 * @returns {Promise<Array>} Array of size objects
 */
const URL=`${process.env.NEXT_PUBLIC_API_URL}/sizes`;

const getSizes = async () => {
  const res = await fetch(URL);

  return res.json();
};

export default getSizes;
