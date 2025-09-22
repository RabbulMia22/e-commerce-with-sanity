import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategory = async () => {
    const ALL_CATEGORY_QUERY = defineQuery(`*[_type == "category"] | order(name asc)`);
    try {
        const categories = await sanityFetch({ query: ALL_CATEGORY_QUERY });
        return categories.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}