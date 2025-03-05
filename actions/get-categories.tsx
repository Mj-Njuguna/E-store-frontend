import { Category } from "@/types";

const URL=`${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
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
